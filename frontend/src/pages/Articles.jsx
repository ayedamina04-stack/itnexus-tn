
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Newspaper,
  Search,
  X,
  Send,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import api from '../services/api';

const demoArticles = [
  {
    _id: 'demo-ai',
    titre: 'How Artificial Intelligence Is Transforming Our Digital Future',
    resume: 'Discover how AI is reshaping industries, changing the way we work and opening new opportunities for developers.',
    contenu: 'Artificial Intelligence is changing the way we interact with technology. From intelligent assistants to machine learning applications, innovation continues to accelerate.',
    categorie: 'Artificial Intelligence',
    datepub: '2026-11-08',
    urlImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85'
  },
  {
    _id: 'demo-cyber',
    titre: 'Cybersecurity: 5 Essential Things Every Developer Should Know',
    resume: 'Security is no longer optional. Explore the practices that help developers build safer applications.',
    contenu: 'Modern applications face growing security challenges. Developers need to understand authentication, data protection and common vulnerabilities.',
    categorie: 'Cybersecurity',
    datepub: '2026-11-06',
    urlImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    _id: 'demo-web',
    titre: 'The Future of Web Development: What Comes Next?',
    resume: 'Explore the tools, frameworks and ideas shaping the next generation of web experiences.',
    contenu: 'Web development continues to evolve with modern frameworks, better developer tools and increasingly interactive experiences.',
    categorie: 'Web Development',
    datepub: '2026-11-04',
    urlImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85'
  }
];

const categories = [
  'All topics',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Data Science',
  'Innovation'
];

const fallbackImages = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85'
];

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All topics');
  const [likedArticles, setLikedArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.articles || data.data || [];

        // Demo stories fill the page until more articles are published.
        const combined = [...list];

        if (combined.length < 3) {
          demoArticles.forEach((demo) => {
            if (combined.length < 3) combined.push(demo);
          });
        }

        setArticles(combined);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load articles. Please check that the server is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const text = `${article.titre || ''} ${article.resume || ''} ${article.categorie || ''}`;

      const matchesSearch = text.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === 'All topics' ||
        (article.categorie || '').toLowerCase().includes(activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [articles, search, activeCategory]);

  const toggleLike = (id) => {
    setLikedArticles((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleSave = (id) => {
    setSavedArticles((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addComment = (event) => {
    event.preventDefault();

    if (!commentInput.trim() || !selectedArticle) return;

    setComments((current) => ({
      ...current,
      [selectedArticle._id]: [
        ...(current[selectedArticle._id] || []),
        commentInput.trim()
      ]
    }));

    setCommentInput('');
  };

  const formatDate = (date) => {
    if (!date) return 'Recently published';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return 'Recently published';

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getImage = (article, index) =>
    article.urlImage || fallbackImages[index % fallbackImages.length];

  const featuredArticle = filteredArticles[0];

  return (
    <div className="articles-page">
      <style>{`
        .articles-page {
          min-height: 100vh;
          background: #080d1b;
          color: #f4f7ff;
          font-family: inherit;
          padding-bottom: 70px;
        }

        .articles-container {
          width: min(1180px, 88%);
          margin: auto;
        }

        .articles-topbar {
          padding: 28px 0;
          border-bottom: 1px solid rgba(148,163,184,.12);
        }

        .articles-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #9baac2;
          text-decoration: none;
          font-size: 14px;
          transition: .2s;
        }

        .articles-back:hover { color: #22d3ee; }

        .articles-hero {
          padding: 75px 0 45px;
          position: relative;
          overflow: hidden;
        }

        .articles-hero::after {
          content: '';
          position: absolute;
          width: 360px;
          height: 360px;
          right: 0;
          top: -150px;
          background: rgba(34,211,238,.09);
          filter: blur(100px);
          pointer-events: none;
        }

        .articles-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #22d3ee;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .articles-hero h1 {
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.05;
          letter-spacing: -2.5px;
          margin: 0 0 20px;
        }

        .articles-gradient {
          background: linear-gradient(90deg, #22d3ee, #818cf8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .articles-hero p {
          color: #9baac2;
          line-height: 1.8;
          max-width: 590px;
          font-size: 16px;
        }

        .articles-stats {
          display: flex;
          gap: 28px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .articles-stat {
          color: #8998b0;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .articles-stat strong {
          color: #f4f7ff;
          font-size: 15px;
        }

        .articles-tools {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          margin: 22px 0 30px;
        }

        .articles-search {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 12px;
          padding: 14px 17px;
          width: min(380px, 100%);
        }

        .articles-search input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 100%;
          font-size: 14px;
        }

        .articles-search input::placeholder { color: #71819b; }

        .articles-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .articles-category {
          border: 1px solid #26344d;
          background: #111a2e;
          color: #9baac2;
          padding: 10px 14px;
          border-radius: 30px;
          font-size: 12px;
          cursor: pointer;
          transition: .2s;
        }

        .articles-category:hover,
        .articles-category.active {
          background: rgba(34,211,238,.12);
          color: #22d3ee;
          border-color: #22d3ee;
        }

        .articles-section-label {
          color: #22d3ee;
          font-size: 11px;
          letter-spacing: 2.5px;
          font-weight: 700;
          margin: 45px 0 20px;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 45px;
          transition: .25s;
        }

        .featured-card:hover,
        .article-card:hover {
          border-color: rgba(34,211,238,.5);
          transform: translateY(-4px);
        }

        .featured-image {
          min-height: 350px;
          position: relative;
        }

        .featured-image img,
        .article-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .featured-content {
          padding: clamp(25px, 4vw, 48px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .article-tag {
          color: #22d3ee;
          background: rgba(34,211,238,.1);
          border: 1px solid rgba(34,211,238,.2);
          border-radius: 30px;
          padding: 7px 11px;
          font-size: 10px;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .featured-content h2 {
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.25;
          margin: 20px 0 14px;
        }

        .featured-content p,
        .article-card-content p {
          color: #9baac2;
          font-size: 14px;
          line-height: 1.8;
        }

        .article-meta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          color: #8190a9;
          font-size: 12px;
          margin-top: 15px;
        }

        .article-meta-row span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .article-actions {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 23px;
          flex-wrap: wrap;
        }

        .article-action {
          border: none;
          background: transparent;
          color: #91a0b8;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-size: 13px;
          padding: 5px 0;
          transition: .2s;
        }

        .article-action:hover,
        .article-action.liked {
          color: #fb7185;
        }

        .article-action.saved { color: #22d3ee; }

        .read-article {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #22d3ee;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          margin-top: 25px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .article-card {
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 17px;
          overflow: hidden;
          transition: .25s;
          min-width: 0;
        }

        .article-card-image {
          height: 205px;
          position: relative;
          overflow: hidden;
        }

        .article-card-image img { transition: transform .4s; }
        .article-card:hover .article-card-image img { transform: scale(1.05); }

        .article-card-content { padding: 21px; }

        .article-card-content h3 {
          font-size: 19px;
          line-height: 1.4;
          margin: 14px 0 10px;
        }

        .article-card-content p {
          font-size: 13px;
          margin: 0;
        }

        .article-card-content .article-actions {
          border-top: 1px solid #26344d;
          padding-top: 15px;
          margin-top: 17px;
        }

        .articles-empty {
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 18px;
          padding: 55px 20px;
          text-align: center;
          color: #9baac2;
        }

        .articles-empty h2 { color: white; }

        .articles-error {
          color: #fb7185;
          background: rgba(251,113,133,.08);
          border: 1px solid rgba(251,113,133,.2);
          padding: 18px;
          border-radius: 12px;
        }

        .articles-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(2,6,18,.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .articles-modal {
          width: min(520px, 100%);
          max-height: 85vh;
          overflow-y: auto;
          background: #111a2e;
          border: 1px solid #33445f;
          border-radius: 18px;
          padding: 25px;
        }

        .articles-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .articles-modal-header h2 { margin: 0; font-size: 21px; }

        .articles-modal-close {
          border: 0;
          background: transparent;
          color: #aab4ca;
          cursor: pointer;
        }

        .comment-list {
          display: grid;
          gap: 12px;
          margin-bottom: 20px;
        }

        .comment-item {
          padding: 13px;
          border-radius: 10px;
          background: #18243a;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .comment-form {
          display: flex;
          gap: 9px;
        }

        .comment-form input {
          min-width: 0;
          flex: 1;
          padding: 13px;
          background: #080d1b;
          border: 1px solid #33445f;
          border-radius: 10px;
          outline: none;
          color: white;
        }

        .comment-form button {
          border: 0;
          border-radius: 10px;
          padding: 0 15px;
          color: #06111f;
          background: #22d3ee;
          cursor: pointer;
        }

        .articles-footer {
          margin-top: 70px;
          padding-top: 25px;
          border-top: 1px solid rgba(148,163,184,.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          color: #71819b;
          font-size: 12px;
        }

        .articles-footer a {
          color: #22d3ee;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .featured-card { grid-template-columns: 1fr; }
          .featured-image { min-height: 260px; }
          .articles-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 560px) {
          .articles-container { width: 90%; }
          .articles-hero { padding-top: 50px; }
          .articles-hero h1 { letter-spacing: -1.5px; }
          .articles-grid { grid-template-columns: 1fr; }
          .articles-tools { align-items: stretch; }
          .articles-search { width: 100%; }
          .articles-categories { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; }
          .articles-category { white-space: nowrap; }
          .featured-image { min-height: 220px; }
        }
      `}</style>

      <div className="articles-topbar">
        <div className="articles-container">
          <Link to="/" className="articles-back">
            <ArrowLeft size={17} /> Back to home
          </Link>
        </div>
      </div>

      <header className="articles-hero">
        <div className="articles-container">
          <div className="articles-eyebrow">
            <Sparkles size={15} /> ITNEXUS TN / THE LATEST
          </div>

          <h1>
            Explore what's<br />
            <span className="articles-gradient">happening in tech.</span>
          </h1>

          <p>
            Your daily source for technology news, fresh perspectives and
            the innovations shaping tomorrow. Stay informed. Stay ahead.
          </p>

          <div className="articles-stats">
            <div className="articles-stat">
              <Newspaper size={17} color="#22d3ee" />
              <strong>{articles.length}</strong> stories
            </div>
            <div className="articles-stat">
              <TrendingUp size={17} color="#22d3ee" />
              <strong>Tech</strong> insights
            </div>
            <div className="articles-stat">
              <Sparkles size={17} color="#22d3ee" />
              <strong>One</strong> community
            </div>
          </div>
        </div>
      </header>

      <div className="articles-container">
        <div className="articles-tools">
          <div className="articles-search">
            <Search size={19} color="#22d3ee" />
            <input
              type="text"
              placeholder="Search stories, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="articles-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`articles-category ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: '#9baac2' }}>Loading the latest stories...</p>}

        {error && <div className="articles-error">{error}</div>}

        {!loading && !error && filteredArticles.length === 0 && (
          <div className="articles-empty">
            <Newspaper size={42} color="#22d3ee" />
            <h2>No stories found</h2>
            <p>Try another keyword or choose a different topic.</p>
          </div>
        )}

        {!loading && !error && featuredArticle && (
          <>
            <div className="articles-section-label">✦ EDITOR'S PICK</div>

            <article className="featured-card">
              <div className="featured-image">
                <img
                  src={getImage(featuredArticle, 0)}
                  alt={featuredArticle.titre}
                />
              </div>

              <div className="featured-content">
                <span className="article-tag">
                  {featuredArticle.categorie || 'TECHNOLOGY'}
                </span>

                <h2>{featuredArticle.titre}</h2>

                <p>
                  {featuredArticle.resume ||
                    featuredArticle.contenu?.slice(0, 190) ||
                    'Discover the latest ideas and innovations from the world of technology.'}
                </p>

                <div className="article-meta-row">
                  <span><CalendarDays size={14} /> {formatDate(featuredArticle.datepub)}</span>
                  <span><Clock3 size={14} /> 5 min read</span>
                </div>

                <div className="article-actions">
                  <button
                    className={`article-action ${likedArticles.includes(featuredArticle._id) ? 'liked' : ''}`}
                    onClick={() => toggleLike(featuredArticle._id)}
                  >
                    <Heart size={17} fill={likedArticles.includes(featuredArticle._id) ? 'currentColor' : 'none'} />
                    {likedArticles.includes(featuredArticle._id) ? 'Liked' : 'Like'}
                  </button>

                  <button
                    className={`article-action ${savedArticles.includes(featuredArticle._id) ? 'saved' : ''}`}
                    onClick={() => toggleSave(featuredArticle._id)}
                  >
                    <Bookmark size={17} fill={savedArticles.includes(featuredArticle._id) ? 'currentColor' : 'none'} />
                    {savedArticles.includes(featuredArticle._id) ? 'Saved' : 'Save'}
                  </button>

                  <button
                    className="article-action"
                    onClick={() => setSelectedArticle(featuredArticle)}
                  >
                    <MessageCircle size={17} />
                    Comments ({(comments[featuredArticle._id] || []).length})
                  </button>
                </div>

                <button
                  className="read-article"
                  onClick={() => setSelectedArticle(featuredArticle)}
                >
                  Read story <ArrowUpRight size={17} />
                </button>
              </div>
            </article>

            <div className="articles-section-label">✦ MORE TO EXPLORE</div>

            <div className="articles-grid">
              {filteredArticles.slice(1).map((article, index) => (
                <article className="article-card" key={article._id}>
                  <div className="article-card-image">
                    <img
                      src={getImage(article, index + 1)}
                      alt={article.titre}
                    />
                  </div>

                  <div className="article-card-content">
                    <span className="article-tag">
                      {article.categorie || 'TECHNOLOGY'}
                    </span>

                    <h3>{article.titre}</h3>

                    <p>
                      {article.resume ||
                        article.contenu?.slice(0, 145) ||
                        'Discover more about the latest technology trends.'}
                    </p>

                    <div className="article-meta-row">
                      <span><CalendarDays size={13} /> {formatDate(article.datepub)}</span>
                    </div>

                    <div className="article-actions">
                      <button
                        className={`article-action ${likedArticles.includes(article._id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(article._id)}
                      >
                        <Heart size={16} fill={likedArticles.includes(article._id) ? 'currentColor' : 'none'} />
                        {likedArticles.includes(article._id) ? 'Liked' : 'Like'}
                      </button>

                      <button
                        className={`article-action ${savedArticles.includes(article._id) ? 'saved' : ''}`}
                        onClick={() => toggleSave(article._id)}
                      >
                        <Bookmark size={16} fill={savedArticles.includes(article._id) ? 'currentColor' : 'none'} />
                        Save
                      </button>

                      <button
                        className="article-action"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <MessageCircle size={16} />
                        Comment
                      </button>
                    </div>

                    <button
                      className="read-article"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read story <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <footer className="articles-footer">
          <span>© 2026 ITNEXUS Tunisia. Made for the curious.</span>
          <Link to="/">Back to ITNEXUS TN <ArrowUpRight size={13} /></Link>
        </footer>
      </div>

      {selectedArticle && (
        <div
          className="articles-modal-backdrop"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="articles-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="articles-modal-header">
              <h2>Join the conversation</h2>
              <button
                className="articles-modal-close"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close comments"
              >
                <X size={22} />
              </button>
            </div>

            <span className="article-tag">
              {selectedArticle.categorie || 'TECHNOLOGY'}
            </span>

            <h3 style={{ lineHeight: 1.5, marginTop: 15 }}>
              {selectedArticle.titre}
            </h3>

            <p style={{ color: '#9baac2', lineHeight: 1.8, fontSize: 14 }}>
              {selectedArticle.contenu || selectedArticle.resume}
            </p>

            <div style={{
              borderTop: '1px solid #26344d',
              paddingTop: 18,
              marginTop: 20
            }}>
              <h3 style={{ fontSize: 16, marginBottom: 15 }}>
                Comments ({(comments[selectedArticle._id] || []).length})
              </h3>

              <div className="comment-list">
                {(comments[selectedArticle._id] || []).length === 0 ? (
                  <p style={{ color: '#8190a9', fontSize: 13 }}>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments[selectedArticle._id].map((comment, index) => (
                    <div className="comment-item" key={index}>
                      {comment}
                    </div>
                  ))
                )}
              </div>

              <form className="comment-form" onSubmit={addComment}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button type="submit" aria-label="Send comment">
                  <Send size={17} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Articles;
