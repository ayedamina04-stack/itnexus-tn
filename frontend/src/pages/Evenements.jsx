
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Search,
  Ticket,
  Heart,
  Bookmark,
  MessageCircle,
  Eye,
  Users,
  X,
  Send,
  Monitor
} from 'lucide-react';
import api from '../services/api';

const demoEvents = [
  {
    _id: 'demo-ai',
    title: 'AI & Innovation Summit Tunisia',
    description:
      'Discover the latest breakthroughs in Artificial Intelligence, meet industry experts and explore how AI is transforming businesses and technology.',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000',
    location: 'Novation City',
    city: 'Sousse',
    category: 'Conférence',
    type: 'Présentiel',
    startDate: '2027-02-15T09:00:00',
    endDate: '2027-02-15T17:00:00',
    registrationDeadline: '2027-02-10T23:59:00',
    capacity: 200,
    likes: [],
    favorites: [],
    comments: [],
    registrations: [],
    views: 124,
    isDemo: true
  },
  {
    _id: 'demo-hackathon',
    title: 'Tunisia Tech Hackathon 2027',
    description:
      '48 hours of creativity, teamwork and coding! Build innovative solutions, collaborate with talented developers and compete for exciting prizes.',
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000',
    location: 'Technopole El Ghazala',
    city: 'Ariana',
    category: 'Hackathon',
    type: 'Présentiel',
    startDate: '2027-03-20T08:00:00',
    endDate: '2027-03-22T18:00:00',
    registrationDeadline: '2027-03-10T23:59:00',
    capacity: 100,
    likes: [],
    favorites: [],
    comments: [],
    registrations: [],
    views: 89,
    isDemo: true
  },
  {
    _id: 'demo-workshop',
    title: 'Full Stack Development Workshop',
    description:
      'A practical workshop covering modern web development with React, Node.js and MongoDB. Learn, build and improve your developer skills.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000',
    location: 'Online',
    city: 'Online',
    category: 'Workshop',
    type: 'En ligne',
    startDate: '2027-04-08T14:00:00',
    endDate: '2027-04-08T17:00:00',
    registrationDeadline: '2027-04-06T23:59:00',
    capacity: 150,
    likes: [],
    favorites: [],
    comments: [],
    registrations: [],
    views: 56,
    isDemo: true
  }
];

const categories = [
  'All Events',
  'Conférence',
  'Workshop',
  'Hackathon',
  'Formation',
  'Networking',
  'Compétition'
];

const categoryNames = {
  'Conférence': 'Conference',
  'Workshop': 'Workshop',
  'Hackathon': 'Hackathon',
  'Formation': 'Training',
  'Networking': 'Networking',
  'Compétition': 'Competition',
  'Autre': 'Other'
};

function formatDate(date) {
  if (!date) return 'Date to be announced';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function isDemo(event) {
  return event._id?.startsWith('demo-');
}

function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Events');

  const [likedEvents, setLikedEvents] = useState({});
  const [savedEvents, setSavedEvents] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState({});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/evenements');

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.evenements || data.events || data.data || [];

        const realEvents = list.map(event => ({
          ...event,
          isDemo: false
        }));

        const missingCount = Math.max(0, 3 - realEvents.length);

        setEvents([
          ...realEvents,
          ...demoEvents.slice(0, missingCount)
        ]);
      } catch (err) {
        console.error(err);
        setEvents(demoEvents);
        setError('We could not connect to the events server. Showing sample events instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const text = [
        event.title,
        event.description,
        event.city,
        event.location,
        event.category
      ].join(' ').toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesCategory =
        category === 'All Events' || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const requireLogin = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      showNotice('Please log in to use this feature.');
      return true;
    }

    showNotice(
      err.response?.data?.message || 'Something went wrong. Please try again.'
    );

    return false;
  };

  const handleLike = async (event) => {
    const demo = isDemo(event);

    if (demo) {
      setLikedEvents(previous => ({
        ...previous,
        [event._id]: !previous[event._id]
      }));
      return;
    }

    try {
      const response = await api.post(`/evenements/${event._id}/like`);

      setLikedEvents(previous => ({
        ...previous,
        [event._id]: response.data.liked
      }));

      setEvents(previous =>
        previous.map(item =>
          item._id === event._id
            ? {
                ...item,
                likes: Array(response.data.likes).fill('like')
              }
            : item
        )
      );
    } catch (err) {
      requireLogin(err);
    }
  };

  const handleFavorite = async (event) => {
    if (isDemo(event)) {
      setSavedEvents(previous => ({
        ...previous,
        [event._id]: !previous[event._id]
      }));
      return;
    }

    try {
      const response = await api.post(`/evenements/${event._id}/favori`);

      setSavedEvents(previous => ({
        ...previous,
        [event._id]: response.data.saved
      }));

      showNotice(response.data.message);
    } catch (err) {
      requireLogin(err);
    }
  };

  const handleRegister = async (event) => {
    const demo = isDemo(event);

    if (demo) {
      setRegisteredEvents(previous => ({
        ...previous,
        [event._id]: !previous[event._id]
      }));

      showNotice(
        registeredEvents[event._id]
          ? 'Sample registration cancelled.'
          : 'Sample registration successful!'
      );
      return;
    }

    try {
      if (registeredEvents[event._id]) {
        await api.delete(`/evenements/${event._id}/inscription`);

        setRegisteredEvents(previous => ({
          ...previous,
          [event._id]: false
        }));

        showNotice('Your registration has been cancelled.');
      } else {
        await api.post(`/evenements/${event._id}/inscription`);

        setRegisteredEvents(previous => ({
          ...previous,
          [event._id]: true
        }));

        showNotice('You are successfully registered!');
      }
    } catch (err) {
      requireLogin(err);
    }
  };

  const openComments = async (event) => {
    setSelectedEvent(event);
    setCommentText('');

    if (isDemo(event)) return;

    try {
      const response = await api.get(`/evenements/${event._id}`);

      setSelectedEvent(response.data);
    } catch (err) {
      console.error(err);
      showNotice('Unable to load comments.');
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !selectedEvent) return;

    if (isDemo(selectedEvent)) {
      const newComment = {
        _id: `comment-${Date.now()}`,
        contenu: commentText.trim(),
        auteur: { name: 'You' },
        datecreation: new Date()
      };

      setSelectedEvent(previous => ({
        ...previous,
        comments: [...(previous.comments || []), newComment]
      }));

      setCommentText('');
      return;
    }

    setCommentLoading(true);

    try {
      await api.post(
        `/evenements/${selectedEvent._id}/commentaires`,
        { contenu: commentText.trim() }
      );

      const response = await api.get(`/evenements/${selectedEvent._id}`);

      setSelectedEvent(response.data);
      setCommentText('');
      showNotice('Comment added successfully!');
    } catch (err) {
      requireLogin(err);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <main className="events-page">
      <style>{`
        .events-page {
          min-height: 100vh;
          background: #080d1b;
          color: #f8fafc;
          font-family: Arial, sans-serif;
          padding: 35px 7% 80px;
        }
        .events-page * { box-sizing: border-box; }
        .events-back {
          color: #22d3ee;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 45px;
          font-size: 14px;
        }
        .events-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }
        .events-eyebrow {
          color: #22d3ee;
          letter-spacing: 3px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .events-hero h1 {
          font-size: clamp(38px, 6vw, 65px);
          line-height: 1.08;
          margin: 15px 0;
          letter-spacing: -2px;
        }
        .events-hero h1 span { color: #22d3ee; }
        .events-description {
          color: #9ba9c2;
          max-width: 580px;
          line-height: 1.8;
          font-size: 15px;
        }
        .events-hero-icon {
          width: 120px;
          height: 120px;
          border: 1px solid #17465b;
          background: #0c1d30;
          color: #22d3ee;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(5deg);
          flex-shrink: 0;
        }
        .events-toolbar {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin: 35px 0 20px;
        }
        .events-search {
          flex: 1;
          min-width: 230px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 12px;
          padding: 0 16px;
          min-height: 50px;
          color: #22d3ee;
        }
        .events-search input {
          background: transparent;
          border: 0;
          outline: 0;
          color: white;
          width: 100%;
          font-size: 14px;
        }
        .events-search input::placeholder { color: #75839c; }
        .events-filters {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin: 22px 0 32px;
        }
        .events-filter {
          background: #111a2e;
          color: #9ba9c2;
          border: 1px solid #26344d;
          border-radius: 30px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 12px;
          transition: .2s;
        }
        .events-filter:hover, .events-filter.active {
          color: #06111f;
          background: #22d3ee;
          border-color: #22d3ee;
        }
        .events-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
        }
        .events-section-title h2 {
          font-size: 23px;
          margin: 0;
        }
        .events-section-title span {
          color: #7e8ca5;
          font-size: 13px;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 23px;
        }
        .event-card {
          background: #111a2e;
          border: 1px solid #25334b;
          border-radius: 17px;
          overflow: hidden;
          transition: transform .25s, border-color .25s;
          min-width: 0;
        }
        .event-card:hover {
          transform: translateY(-5px);
          border-color: #167e9b;
        }
        .event-image-wrap {
          height: 195px;
          position: relative;
          overflow: hidden;
          background: #17243a;
        }
        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }
        .event-card:hover .event-image { transform: scale(1.05); }
        .event-image-label {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(8,13,27,.88);
          color: #22d3ee;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }
        .event-card-content { padding: 20px; }
        .event-card h3 {
          font-size: 19px;
          line-height: 1.4;
          margin: 10px 0;
          color: #f8fafc;
        }
        .event-card-description {
          color: #9ba9c2;
          font-size: 13px;
          line-height: 1.7;
          min-height: 66px;
        }
        .event-meta {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #9ba9c2;
          font-size: 12px;
          margin-top: 13px;
        }
        .event-meta svg { color: #22d3ee; flex-shrink: 0; }
        .event-card-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          border-top: 1px solid #26344d;
          margin-top: 19px;
          padding-top: 15px;
        }
        .event-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          color: #9ba9c2;
          cursor: pointer;
          font-size: 12px;
          padding: 4px 0;
        }
        .event-action:hover, .event-action.selected { color: #22d3ee; }
        .event-action.liked { color: #fb7185; }
        .event-register {
          width: 100%;
          border: 0;
          border-radius: 9px;
          padding: 12px;
          margin-top: 18px;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
          color: #06111f;
          background: #22d3ee;
          transition: .2s;
        }
        .event-register:hover { background: #67e8f9; }
        .event-register.registered {
          color: #22d3ee;
          background: #102d3a;
          border: 1px solid #17647a;
        }
        .events-empty {
          text-align: center;
          padding: 65px 20px;
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 17px;
          color: #9ba9c2;
        }
        .events-empty svg { color: #22d3ee; }
        .events-empty h3 { color: white; }
        .events-notice {
          position: fixed;
          z-index: 20;
          bottom: 25px;
          right: 25px;
          max-width: 340px;
          background: #102d3a;
          border: 1px solid #22d3ee;
          color: #e0faff;
          padding: 15px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 35px #0006;
          font-size: 13px;
        }
        .event-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 30;
          background: #020617d9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .event-modal {
          width: 100%;
          max-width: 560px;
          max-height: 85vh;
          overflow-y: auto;
          background: #111a2e;
          border: 1px solid #26344d;
          border-radius: 18px;
          padding: 25px;
        }
        .event-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .event-modal-header h2 { margin: 0; font-size: 21px; }
        .event-modal-close {
          background: transparent;
          color: #9ba9c2;
          border: 0;
          cursor: pointer;
        }
        .event-comment {
          background: #0b1425;
          border-radius: 10px;
          padding: 13px;
          margin-bottom: 10px;
        }
        .event-comment strong { color: #22d3ee; font-size: 13px; }
        .event-comment p {
          color: #d3dbea;
          font-size: 13px;
          line-height: 1.6;
          margin: 7px 0 0;
          overflow-wrap: anywhere;
        }
        .event-comment-form {
          display: flex;
          gap: 9px;
          margin-top: 20px;
        }
        .event-comment-form input {
          flex: 1;
          min-width: 0;
          background: #080d1b;
          border: 1px solid #26344d;
          border-radius: 9px;
          padding: 12px;
          color: white;
          outline: none;
        }
        .event-comment-form button {
          border: 0;
          border-radius: 9px;
          background: #22d3ee;
          color: #06111f;
          padding: 0 15px;
          cursor: pointer;
        }
        @media(max-width: 650px) {
          .events-page { padding: 25px 5% 60px; }
          .events-hero-icon { display: none; }
          .events-back { margin-bottom: 30px; }
          .event-image-wrap { height: 180px; }
          .events-toolbar { margin-top: 25px; }
        }
      `}</style>

      <Link to="/" className="events-back">
        <ArrowLeft size={18} />
        Back to home
      </Link>

      <section className="events-hero">
        <div>
          <p className="events-eyebrow">ITNEXUS TN / COMMUNITY AGENDA</p>

          <h1>
            Discover Tech <span>Events.</span>
          </h1>

          <p className="events-description">
            Connect, learn and innovate. Explore conferences, hackathons,
            workshops and networking opportunities across Tunisia.
          </p>
        </div>

        <div className="events-hero-icon">
          <CalendarDays size={58} />
        </div>
      </section>

      <div className="events-toolbar">
        <div className="events-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search events, cities, topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="events-filters">
        {categories.map(item => (
          <button
            key={item}
            className={`events-filter ${category === item ? 'active' : ''}`}
            onClick={() => setCategory(item)}
          >
            {item === 'All Events' ? item : categoryNames[item]}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: '#fbbf24', fontSize: 13, marginBottom: 20 }}>
          {error}
        </p>
      )}

      <div className="events-section-title">
        <h2>Upcoming Events</h2>
        <span>{filteredEvents.length} events found</span>
      </div>

      {loading ? (
        <p style={{ color: '#9ba9c2' }}>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <div className="events-empty">
          <Ticket size={42} />
          <h3>No events found</h3>
          <p>Try another keyword or category.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => {
            const liked = !!likedEvents[event._id];
            const saved = !!savedEvents[event._id];
            const registered = !!registeredEvents[event._id];

            const likesCount = event.likes?.length || 0;
            const commentsCount = event.comments?.length || 0;
            const registrationsCount = event.registrations?.length || 0;

            return (
              <article className="event-card" key={event._id}>
                <div className="event-image-wrap">
                  <img
                    className="event-image"
                    src={
                      event.imageUrl ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000'
                    }
                    alt={event.title}
                    onError={e => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000';
                    }}
                  />

                  <span className="event-image-label">
                    {categoryNames[event.category] || 'Tech Event'}
                  </span>
                </div>

                <div className="event-card-content">
                  <h3>{event.title}</h3>

                  <p className="event-card-description">
                    {event.description?.slice(0, 145)}
                    {event.description?.length > 145 ? '...' : ''}
                  </p>

                  <div className="event-meta">
                    <CalendarDays size={15} />
                    {formatDate(event.startDate)}
                  </div>

                  <div className="event-meta">
                    <MapPin size={15} />
                    {[event.location, event.city]
                      .filter(Boolean)
                      .join(', ') || 'Location TBA'}
                  </div>

                  <div className="event-meta">
                    {event.type === 'En ligne' ? (
                      <Monitor size={15} />
                    ) : (
                      <Users size={15} />
                    )}
                    {event.type === 'En ligne'
                      ? 'Online'
                      : event.type === 'Hybride'
                        ? 'Hybrid'
                        : 'In person'}
                  </div>

                  <div className="event-meta">
                    <Ticket size={15} />
                    {registrationsCount} / {event.capacity || '—'} registered
                  </div>

                  <div className="event-card-actions">
                    <button
                      className={`event-action ${liked ? 'liked' : ''}`}
                      onClick={() => handleLike(event)}
                      title="Like event"
                    >
                      <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
                      {likesCount + (liked ? 1 : 0)}
                    </button>

                    <button
                      className="event-action"
                      onClick={() => openComments(event)}
                      title="Comments"
                    >
                      <MessageCircle size={17} />
                      {commentsCount}
                    </button>

                    <button
                      className={`event-action ${saved ? 'selected' : ''}`}
                      onClick={() => handleFavorite(event)}
                      title="Save event"
                    >
                      <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
                      Save
                    </button>

                    <span className="event-action" style={{ marginLeft: 'auto' }}>
                      <Eye size={15} />
                      {event.views || 0}
                    </span>
                  </div>

                  <button
                    className={`event-register ${registered ? 'registered' : ''}`}
                    onClick={() => handleRegister(event)}
                  >
                    {registered ? 'Cancel Registration' : 'Register Now'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {notice && (
        <div className="events-notice">
          {notice}
          {notice.includes('log in') && (
            <Link
              to="/login"
              style={{
                color: '#22d3ee',
                display: 'block',
                marginTop: 8
              }}
            >
              Go to login →
            </Link>
          )}
        </div>
      )}

      {selectedEvent && (
        <div
          className="event-modal-backdrop"
          onClick={() => setSelectedEvent(null)}
        >
          <div className="event-modal" onClick={e => e.stopPropagation()}>
            <div className="event-modal-header">
              <h2>Event discussion</h2>

              <button
                className="event-modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                <X size={22} />
              </button>
            </div>

            <p style={{ color: '#22d3ee', fontSize: 13, marginBottom: 20 }}>
              {selectedEvent.title}
            </p>

            {(selectedEvent.comments || []).length === 0 ? (
              <p style={{ color: '#9ba9c2', fontSize: 13 }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              selectedEvent.comments.map((comment, index) => (
                <div className="event-comment" key={comment._id || index}>
                  <strong>
                    {comment.auteur?.name || comment.auteur?.email || 'Community member'}
                  </strong>

                  <p>{comment.contenu}</p>
                </div>
              ))
            )}

            <form className="event-comment-form" onSubmit={submitComment}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                maxLength={1000}
              />

              <button type="submit" disabled={commentLoading || !commentText.trim()}>
                <Send size={17} />
              </button>
            </form>

            {isDemo(selectedEvent) && (
              <p style={{ color: '#8492aa', fontSize: 11, marginTop: 12 }}>
                Sample event: comments are only temporary.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Evenements;
