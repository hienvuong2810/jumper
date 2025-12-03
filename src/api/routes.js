const express = require('express');
const router = express.Router();
const db = require('../db');

// Bonus endpoint: engagement trends
router.get('/trends/engagement', async (req, res) => {
    try {
        // A simple trend: engagement count per day
        const query = `
            SELECT 
                DATE(engaged_timestamp) as engagement_date, 
                COUNT(engagement_id) as total_engagements
            FROM 
                engagements
            GROUP BY 
                engagement_date
            ORDER BY 
                engagement_date;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Top authors/categories by engagement (views, likes, shares) over recent periods
router.get('/analysis/top-authors', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.name,
                COUNT(e.engagement_id) as total_engagements
            FROM engagements e
            JOIN posts p ON e.post_id = p.post_id
            JOIN authors a ON p.author_id = a.author_id
            GROUP BY a.name
            ORDER BY total_engagements DESC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Time-of-day / day-of-week engagement patterns
router.get('/analysis/engagement-patterns', async (req, res) => {
    try {
        const query = `
            SELECT 
                EXTRACT(DOW FROM engaged_timestamp) as day_of_week,
                EXTRACT(HOUR FROM engaged_timestamp) as hour_of_day,
                COUNT(engagement_id) as total_engagements
            FROM engagements
            GROUP BY day_of_week, hour_of_day
            ORDER BY day_of_week, hour_of_day;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Authors/categories with high posting volume but low engagement per post
router.get('/analysis/low-engagement-authors', async (req, res) => {
    try {
        const query = `
            WITH author_stats AS (
                SELECT
                    a.author_id,
                    a.name,
                    COUNT(DISTINCT p.post_id) as post_count,
                    COUNT(e.engagement_id) as total_engagements
                FROM authors a
                LEFT JOIN posts p ON a.author_id = p.author_id
                LEFT JOIN engagements e ON p.post_id = e.post_id
                GROUP BY a.author_id, a.name
            )
            SELECT 
                name,
                post_count,
                total_engagements,
                CASE 
                    WHEN post_count > 0 THEN total_engagements::FLOAT / post_count
                    ELSE 0 
                END as engagement_per_post
            FROM author_stats
            ORDER BY post_count DESC, engagement_per_post ASC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Engagement trend by author & category over time
router.get('/analysis/engagement-over-time', async (req, res) => {
    try {
        const query = `
            SELECT
                DATE_TRUNC('week', e.engaged_timestamp)::DATE AS week,
                a.name AS author_name,
                p.category,
                COUNT(e.engagement_id) AS total_engagements
            FROM engagements e
            JOIN posts p ON e.post_id = p.post_id
            JOIN authors a ON p.author_id = a.author_id
            WHERE e.engaged_timestamp >= NOW() - INTERVAL '3 months'
            GROUP BY week, author_name, p.category
            ORDER BY week, author_name;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
