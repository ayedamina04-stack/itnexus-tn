
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  MapPin,
  Menu,
  Search,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  ChevronRight,
  Mail,
  GitBranch,
  BriefcaseBusiness,
  Camera
} from 'lucide-react';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const articles = [
  {
    id: 1,
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'The AI revolution is changing the way we build software',
    excerpt: 'From intelligent assistants to autonomous agents, discover the technologies shaping the next generation of development.',
    author: 'Tech Editorial',
    date: 'Nov 08, 2026',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85',
    featured: true
  },
  {
    id: 2,
    category: 'CYBERSECURITY',
    title: 'Cybersecurity in 2026: the threats developers should know',
    excerpt: 'A practical look at the security challenges facing modern applications.',
    author: 'Tech Editorial',
    date: 'Nov 06, 2026',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 3,
    category: 'WEB DEVELOPMENT',
    title: 'Beyond the basics: what is next for the React ecosystem?',
    excerpt: 'New tools and ideas are redefining the modern frontend workflow.',
    author: 'Tech Editorial',
    date: 'Nov 04, 2026',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85'
  }
];

const events = [
  {
    id: 1,
    day: '21',
    month: 'NOV',
    category: 'HACKATHON',
    title: 'Tunisian AI Hackathon 2026',
    location: 'Tunis, Tunisia',
    type: 'In person',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 2,
    day: '28',
    month: 'NOV',
    category: 'CONFERENCE',
    title: 'Digital Transformation Summit',
    location: 'Sousse, Tunisia',
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 3,
    day: '05',
    month: 'DEC',
    category: 'WORKSHOP',
    title: 'Build your first AI-powered app',
    location: 'Online',
    type: 'Online',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85'
  }
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);

  const toggleSave = (id) => {
    setSavedArticles((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="announcement">
        <span className="announcement-dot"></span>
        YOUR DAILY DOSE OF TECH, INNOVATION & COMMUNITY
        <ArrowUpRight size={14} />
      </div>

      <header className="navbar">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-icon"><Zap size={21} fill="currentColor" /></span>
          <span>IT<span className="brand-accent">NEXUS</span></span>
          <span className="brand-country">TN</span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <Link to="/" className="active" onClick={closeMenu}>Home</Link>
          <Link to="/articles" onClick={closeMenu}>Tech news</Link>
          <Link to="/evenements" onClick={closeMenu}>Events</Link>
          <a href="#community" onClick={closeMenu}>Community</a>
        </nav>

        <div className="nav-actions">
          <Link to="/articles" className="icon-button" aria-label="Search">
            <Search size={19} />
          </Link>
          <Link to="/login" className="login-link">Log in</Link>
          <Link to="/register" className="nav-cta">
            Join the community <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={15} /> THE TECH COMMUNITY HUB</div>

            <h1>
              Stay curious.<br />
              Stay <span className="gradient-text">ahead.</span>
            </h1>

            <p className="hero-description">
              Your space to explore technology, discover what's next,
              and connect with the people shaping the digital future in Tunisia.
            </p>

            <div className="hero-buttons">
              <Link to="/articles" className="primary-button">
                Explore the latest <ArrowRight size={17} />
              </Link>
              <Link to="/evenements" className="secondary-button">
                Discover events
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span>👩🏻‍💻</span><span>👨🏽‍💻</span><span>👩🏽‍🚀</span><span>👨🏻‍💻</span>
              </div>
              <div>
                <strong>Built for curious minds</strong>
                <small>Learn · Share · Connect</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90"
                alt="Modern computer circuit board"
              />
              <div className="image-overlay"></div>

              <div className="floating-label label-top">
                <span className="live-dot"></span> WHAT'S HAPPENING IN TECH
              </div>

              <div className="floating-card">
                <span className="floating-card-icon"><TrendingUp size={18} /></span>
                <div>
                  <small>THE FUTURE IS NOW</small>
                  <strong>Ideas become innovation.</strong>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </div>

            <div className="hero-orbit orbit-one"></div>
            <div className="hero-orbit orbit-two"></div>
            <span className="hero-decoration">01 / DISCOVER</span>
          </div>
        </section>

        <section className="topic-strip">
          <span className="topic-label">EXPLORE TOPICS</span>
          <Link to="/articles">Artificial Intelligence <ArrowUpRight size={13} /></Link>
          <Link to="/articles">Web Development <ArrowUpRight size={13} /></Link>
          <Link to="/articles">Cybersecurity <ArrowUpRight size={13} /></Link>
          <Link to="/articles">Data Science <ArrowUpRight size={13} /></Link>
          <Link to="/articles">Innovation <ArrowUpRight size={13} /></Link>
        </section>

        <section className="content-section" id="articles">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="section-line"></span> THE LATEST</div>
              <h2>Ideas worth <span className="gradient-text">exploring.</span></h2>
              <p>Fresh perspectives, important updates and stories from the tech world.</p>
            </div>
            <Link to="/articles" className="text-link">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>

          <div className="articles-grid">
            {articles.map((article) => (
              <article
                className={article.featured ? 'article-card featured-article' : 'article-card'}
                key={article.id}
              >
                <div className="article-image">
                  <img src={article.image} alt="" />
                  <span className="image-category">{article.category}</span>

                  <button
                    className={savedArticles.includes(article.id) ? 'save-button saved' : 'save-button'}
                    onClick={() => toggleSave(article.id)}
                    aria-label="Save article"
                    title="Save article"
                  >
                    <Bookmark
                      size={17}
                      fill={savedArticles.includes(article.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <div className="article-info">
                  <div className="article-meta">
                    <span>{article.date}</span>
                    <span className="meta-separator">•</span>
                    <span>{article.read}</span>
                  </div>

                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>

                  <div className="article-bottom">
                    <span className="author-name">
                      <span className="author-avatar">N</span>
                      {article.author}
                    </span>
                    <Link to="/articles" className="round-arrow" aria-label="Read article">
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="section-line"></span> MEET. LEARN. BUILD.</div>
              <h2>Don't just watch.<br /><span className="gradient-text">Be part of it.</span></h2>
              <p>Find your next hackathon, workshop or tech meetup.</p>
            </div>
            <Link to="/evenements" className="text-link">
              Explore all events <ArrowRight size={16} />
            </Link>
          </div>

          <div className="events-grid">
            {events.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-image">
                  <img src={event.image} alt="" />
                  <span className="event-category">{event.category}</span>
                  <div className="event-date">
                    <strong>{event.day}</strong>
                    <span>{event.month}</span>
                  </div>
                </div>

                <div className="event-info">
                  <h3>{event.title}</h3>
                  <div className="event-detail"><MapPin size={15} /> {event.location}</div>
                  <div className="event-detail"><CalendarDays size={15} /> {event.type}</div>
                  <Link to="/evenements" className="event-link">
                    Discover event <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="community-banner" id="community">
          <div className="community-glow"></div>

          <div className="community-content">
            <div className="eyebrow"><Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE</div>
            <h2>Technology moves fast.<br /><span className="gradient-text">Grow with the community.</span></h2>
            <p>Discover opportunities, exchange ideas and meet people who are just as passionate about technology as you are.</p>
            <Link to="/register" className="primary-button">
              Become a member <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="community-art">
            <div className="community-ring ring-a"></div>
            <div className="community-ring ring-b"></div>
            <div className="community-center"><Zap size={42} fill="currentColor" /></div>
            <span className="community-tag tag-a">LEARN</span>
            <span className="community-tag tag-b">CREATE</span>
            <span className="community-tag tag-c">CONNECT</span>
          </div>
        </section>

        <section className="newsletter">
          <div className="newsletter-icon"><Mail size={22} /></div>

          <div className="newsletter-text">
            <h3>Stay in the loop.</h3>
            <p>Get the latest tech stories and upcoming events in your inbox.</p>
          </div>

          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Your email address" />
            <button type="submit">Subscribe <ArrowRight size={16} /></button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-icon"><Zap size={21} fill="currentColor" /></span>
              <span>IT<span className="brand-accent">NEXUS</span></span>
              <span className="brand-country">TN</span>
            </Link>
            <p>A space for tech enthusiasts to stay informed, discover opportunities and grow together.</p>
          </div>

          <div className="footer-column">
            <strong>EXPLORE</strong>
            <Link to="/articles">Tech news</Link>
            <Link to="/evenements">Events</Link>
            <a href="#community">Community</a>
          </div>

          <div className="footer-column">
            <strong>ACCOUNT</strong>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/login">My profile</Link>
          </div>

          <div className="footer-column">
            <strong>FOLLOW THE COMMUNITY</strong>
            <div className="social-links">
              <a href="https://github.com" aria-label="GitHub"><GitBranch size={18} /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn"><BriefcaseBusiness size={18} /></a>
              <a href="https://instagram.com" aria-label="Instagram"><Camera size={18} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ITNEXUS Tunisia. Made for the curious.</span>
          <span>BUILT WITH CURIOSITY <span className="footer-heart">✦</span></span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
