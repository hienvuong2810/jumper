# 📄 Jumper Media — Senior Developer (Data Analytics)
**Take-Home Assignment**

## Purpose
We want to see how you take messy data, derive insights, architect for performance, and push things toward value — with autonomy, cleanliness, and creativity.

---

## 1. Sample Schema & Data

Below is a suggested schema and mock/sample data. Feel free to adjust slightly if you think a better design or structure helps. The sample data is minimal; you’ll simulate scale or imagine larger data to guide performance decisions.

### Schema (PostgreSQL)

| Table | Columns | Notes |
|-------|---------|--------|
| authors | author_id (PK), name, joined_date, author_category | author_category = e.g. “Tech”, “Lifestyle”, etc. |
| posts | post_id (PK), author_id (FK), category, publish_timestamp, title, content_length, has_media (boolean) | category probably overlaps with author_category but can differ; content_length = word count or chars |
| engagements | engagement_id (PK), post_id (FK), type (enum: ‘view’, ‘like’, ‘comment’, ‘share’), user_id, engaged_timestamp | Each engagement is one record; user_id optional/dummy if needed |
| post_metadata | post_id (PK, FK), tags (array or linking table), is_promoted (boolean), language | optional extra info |
| users | user_id (PK), signup_date, country, user_segment | optional; may help with filters/cohorts |

---

### Sample Data

#### authors
| author_id | name | joined_date | author_category |
|-----------|------|-------------|-----------------|
| 1 | Alice | 2020-01-14 | Tech |
| 2 | Bob | 2019-06-30 | Lifestyle |
| 3 | Carlos | 2021-11-05 | Tech |

#### posts
| post_id | author_id | category | publish_timestamp | title | content_length | has_media |
|---------|-----------|----------|-------------------|--------|----------------|-----------|
| 101 | 1 | Tech | 2025-08-01 10:15:00 | Deep Dive into X | 1200 | true |
| 102 | 2 | Lifestyle | 2025-08-02 17:30:00 | 5 Morning Routines | 800 | false |
| 103 | 3 | Tech | 2025-08-03 08:45:00 | Why we love SQL | 950 | true |

#### engagements
| engagement_id | post_id | type | user_id | engaged_timestamp |
|---------------|---------|------|---------|--------------------|
| 2001 | 101 | view | 501 | 2025-08-01 10:16:00 |
| 2002 | 101 | like | 502 | 2025-08-01 10:17:00 |
| 2003 | 102 | comment | 503 | 2025-08-02 17:45:00 |
| 2004 | 101 | share | 504 | 2025-08-01 11:00:00 |
| 2005 | 103 | view | 505 | 2025-08-03 09:00:00 |

#### post_metadata
| post_id | tags | is_promoted | language |
|---------|-------|--------------|-----------|
| 101 | ["SQL", "Optimization"] | false | en |
| 102 | ["Wellness", "Morning"] | true | en |
| 103 | ["SQL", "Postgres", "Tips"] | false | en |

#### users
| user_id | signup_date | country | user_segment |
|---------|--------------|----------|----------------|
| 501 | 2025-01-10 | US | free |
| 502 | 2025-02-12 | UK | subscriber |
| 503 | 2024-12-05 | US | trial |

---

## 2. Assignment Instructions

### What we expect

### 1. Schema / Data Prep
- Load the sample data into PostgreSQL.
- If you think improvements (indexes, partitioning, etc.) help, propose or implement them.

### 2. Analysis & Queries
Write queries to answer at least:
- Top authors/categories by engagement (views, likes, shares) over recent periods
- Time-of-day / day-of-week engagement patterns
- Authors/categories with high posting volume but low engagement per post

Show how you'd optimize performance on larger datasets.

### 3. Visualizations / Dashboard
Examples:
- Trend of engagement by author & category over time
- Heatmap of engagement by hour/day
- Scatter plot: volume vs engagement per post

### 4. Recommendations
- Suggest 2–3 actionable experiments or content/product changes.
- Prioritize them by impact vs effort.
- Mention assumptions or missing data you wish you had.

### 5. Bonus
- Build a small API endpoint returning engagement trends.
- Explain deployment or microservice embedding.

---

## 3. Deliverables & Timeline

### Deliverables:
- PostgreSQL schema + load scripts  
- SQL queries  
- Code/notebooks for visualizations  
- Write-up (Markdown or PDF) with recommendations  
- (Optional) API endpoint  

### Timeline:
- ~4 days to complete  
- Assume independent work; ambiguity handling is evaluated  

---

## 4. Evaluation Criteria

| Category | What We Assess | What a Top Candidate Does |
|----------|----------------|----------------------------|
| Technical: PostgreSQL & DB Design | Schema design, query optimization, scaling | Predicts pitfalls, uses indexes, handles bottlenecks |
| Data Analytics & Insight | Depth and clarity of insights | Finds non-obvious patterns; suggests meaningful directions |
| Code Quality & Architecture | Clean, modular, documented, scalable | Easy-to-read code; future-proof design |
| Ownership & Self‑Direction | Handling ambiguity, assumptions, trade-offs | States assumptions clearly; makes justified decisions |
| Creativity & Impact | Value of recommendations; visualization quality | Proposes high-impact experiments; storytelling visuals |
| Bonus | API or microservice polish | Works cleanly with deployability |

