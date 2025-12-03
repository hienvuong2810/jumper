const db = require('./index');

// Helper functions to generate random data
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function setupDatabase() {
  const client = await db.query('SELECT 1').then(() => db.query('SELECT NOW()')).catch(err => {
      console.error('Error connecting to the database', err);
      process.exit(1);
  });
  console.log('Connected to database.');

  try {
    console.log('Dropping existing tables...');
    await db.query(`
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS post_metadata CASCADE;
        DROP TABLE IF EXISTS engagements CASCADE;
        DROP TABLE IF EXISTS posts CASCADE;
        DROP TABLE IF EXISTS authors CASCADE;
    `);

    console.log('Creating tables...');
    await db.query(`
        CREATE TABLE authors (
            author_id INT PRIMARY KEY,
            name VARCHAR(255),
            joined_date DATE,
            author_category VARCHAR(50)
        );
        
        CREATE TABLE posts (
            post_id INT PRIMARY KEY,
            author_id INT REFERENCES authors(author_id),
            category VARCHAR(50),
            publish_timestamp TIMESTAMP,
            title VARCHAR(255),
            content_length INT,
            has_media BOOLEAN
        );
        
        CREATE TABLE users (
            user_id INT PRIMARY KEY,
            signup_date DATE,
            country VARCHAR(50),
            user_segment VARCHAR(50)
        );
        
        CREATE TABLE engagements (
            engagement_id SERIAL PRIMARY KEY,
            post_id INT REFERENCES posts(post_id),
            type VARCHAR(10) CHECK (type IN ('view', 'like', 'comment', 'share')),
            user_id INT REFERENCES users(user_id),
            engaged_timestamp TIMESTAMP
        );
        
        CREATE TABLE post_metadata (
            post_id INT PRIMARY KEY REFERENCES posts(post_id),
            tags TEXT[],
            is_promoted BOOLEAN,
            language VARCHAR(10)
        );
    `);

    console.log('Inserting data...');

    // Generate Authors
    const authorCategories = ['Tech', 'Lifestyle', 'Business', 'Science', 'Health', 'Travel'];
    let authorValues = [];
    for (let i = 1; i <= 20; i++) {
        authorValues.push(`(${i}, 'Author ${i}', '${randomDate(new Date(2018, 0, 1), new Date()).toISOString().split('T')[0]}', '${randomElement(authorCategories)}')`);
    }
    await db.query(`INSERT INTO authors (author_id, name, joined_date, author_category) VALUES ${authorValues.join(', ')}`);
    console.log('Inserted 20 authors.');

    // Generate Users
    const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'IN'];
    const segments = ['free', 'subscriber', 'trial', 'premium'];
    let userValues = [];
    for (let i = 1; i <= 500; i++) {
        userValues.push(`(${i}, '${randomDate(new Date(2022, 0, 1), new Date()).toISOString().split('T')[0]}', '${randomElement(countries)}', '${randomElement(segments)}')`);
    }
    await db.query(`INSERT INTO users (user_id, signup_date, country, user_segment) VALUES ${userValues.join(', ')}`);
    console.log('Inserted 500 users.');
    
    // Generate Posts and Metadata
    const postCategories = ['Tech', 'Lifestyle', 'Business', 'Science', 'Health', 'Travel', 'DIY', 'Finance'];
    const tags = ['SQL', 'Optimization', 'Wellness', 'Morning', 'Postgres', 'Tips', 'Startups', 'AI', 'Keto', 'Yoga'];
    let postValues = [];
    let metadataValues = [];
    let postId = 1;
    for (let authorId = 1; authorId <= 20; authorId++) {
        const numPosts = randomInt(5, 25); // Each author has between 5 and 25 posts
        for (let j = 0; j < numPosts; j++) {
            postValues.push(`(${postId}, ${authorId}, '${randomElement(postCategories)}', '${randomDate(new Date(2024, 0, 1), new Date()).toISOString()}', 'Post Title ${postId}', ${randomInt(200, 3000)}, ${Math.random() > 0.5})`);
            
            const numTags = randomInt(1, 4);
            let postTags = [];
            for(let k=0; k<numTags; k++) {
                postTags.push(`'${randomElement(tags)}'`);
            }
            metadataValues.push(`(${postId}, ARRAY[${postTags.join(', ')}], ${Math.random() > 0.8}, 'en')`);
            
            postId++;
        }
    }
    await db.query(`INSERT INTO posts (post_id, author_id, category, publish_timestamp, title, content_length, has_media) VALUES ${postValues.join(', ')}`);
    await db.query(`INSERT INTO post_metadata (post_id, tags, is_promoted, language) VALUES ${metadataValues.join(', ')}`);
    console.log(`Inserted ${postId - 1} posts and metadata entries.`);
    
    // Generate Engagements
    let engagementValues = [];
    const engagementTypes = ['view', 'like', 'comment', 'share'];
    const postsResult = await db.query('SELECT post_id, publish_timestamp FROM posts');
    for (const post of postsResult.rows) {
        const numEngagements = randomInt(10, 500);
        for (let i = 0; i < numEngagements; i++) {
            const engagementType = randomElement(engagementTypes);
            const userId = randomInt(1, 500);
            const engagementDate = randomDate(new Date(post.publish_timestamp), new Date());
            engagementValues.push(`(${post.post_id}, '${engagementType}', ${userId}, '${engagementDate.toISOString()}')`);
        }
    }
    await db.query(`INSERT INTO engagements (post_id, type, user_id, engaged_timestamp) VALUES ${engagementValues.join(', ')}`);
    console.log(`Inserted ${engagementValues.length} engagements.`);

    console.log('Creating indexes for performance optimization...');
    await db.query(`
      CREATE INDEX idx_posts_author_id ON posts(author_id);
      CREATE INDEX idx_engagements_post_id ON engagements(post_id);
      CREATE INDEX idx_engagements_timestamp ON engagements(engaged_timestamp DESC);
    `);
    console.log('Indexes created successfully.');

    console.log('Database setup complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error setting up database', err);
    process.exit(1);
  }
}

setupDatabase();
