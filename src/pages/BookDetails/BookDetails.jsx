// BookDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Star,
  PlayCircle,
  PauseCircle,
  Download,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import BookCard from "../../components/BookCard/BookCard";

/** Demo reviews DB (unchanged) */
const REVIEWS_DB = {
  "5": {
    heading: "Employee Review",
    overall: 4.7,
    total: 2713,
    breakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 },
    images: [
      "https://images.unsplash.com/photo-1544937950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Humayun Kabir", title: "An absolute masterpiece even in 2025", stars: 5, country: "Bangladesh", date: "July 2, 2025", verified: true, body: "Moves you from low-level to high-level architectural thinking. Evergreen patterns and trade-offs. Senior engineers loved it.", helpful: 56 },
      { id: "r2", name: "Lubaba Jahan", title: "Must Read", stars: 5, country: "Bangladesh", date: "May 26, 2025", verified: false, body: "Seminal work. Not a quick read, but worth the effort. Clear patterns and timeless insights.", helpful: 14 },
      { id: "r3", name: "Rashedul Zaman", title: "Great print, good quality cover", stars: 4, country: "Bangladesh", date: "April 22, 2025", verified: true, body: "Well packaged, arrived flat. Solid examples and commentary.", helpful: 9 },
      { id: "r4", name: "Tasmania Rosa .", title: "Practical patterns", stars: 5, country: "Bangladesh", date: "March 02, 2025", verified: true, body: "Explains trade-offs clearly. Helped our team refactor services.", helpful: 11 },
      { id: "r5", name: "Shuvo Rahman", title: "Dense but rewarding", stars: 4, country: "Bangladesh", date: "Feb 18, 2025", verified: false, body: "Take it slow. Examples are timeless.", helpful: 7 },
      { id: "r6", name: "Maruf Islam", title: "Go-to reference", stars: 5, country: "Bangladesh", date: "January 11, 2025", verified: true, body: "Keep it on my desk. Patterns map to modern stacks easily.", helpful: 18 },
      { id: "r7", name: "Sazal Uddin.", title: "Bridges theory and practice", stars: 5, country: "Bangladesh", date: "Nov 3, 2024", verified: true, body: "Rare book that improves code quality quickly.", helpful: 6 },
      { id: "r8", name: "Naimur Hasan", title: "A classic", stars: 5, country: "Bangladesh", date: "Sep 1, 2024", verified: false, body: "Still relevant, even with new frameworks.", helpful: 4 },
    ],
  },
  "2": {
    heading: "Employee Review",
    overall: 4.9,
    total: 1045,
    breakdown: { 5: 88, 4: 9, 3: 2, 2: 1, 1: 0 },
    images: [],
    reviews: [
      { id: "r9", name: "Nadia Zahan.", title: "Clear cloud strategy playbook", stars: 5, country: "Bangladesh", date: "May 10, 2024", verified: true, body: "Vendor-neutral frameworks. Helped us choose a service model and avoid re-architecture.", helpful: 22 },
      { id: "r10", name: "Vitul Shohan", title: "Strong patterns", stars: 4, country: "Bangladesh", date: "Aug 8, 2024", verified: false, body: "Good balance of business & tech requirements.", helpful: 5 },
      { id: "r11", name: "Purification Meril", title: "Great case studies", stars: 5, country: "Bangladesh", date: "Jan 20, 2025", verified: true, body: "Real migrations and pitfalls. Very useful.", helpful: 9 },
    ],
  },
  "1": {
    heading: "Employee Review",
    overall: 4.0,
    total: 1,
    breakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
    images: [],
    reviews: [
      { id: "r12", name: "Alisha Rahman", title: "Inspiring for founders", stars: 5, country: "Bangladesh", date: "March 5, 2023", verified: true, body: "Concise, motivating, and practical.", helpful: 3 },
    ],
  },
};

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [stats, setStats] = useState({ available: 0, upcoming: 0, unavailable: 0 });

  // Spec & Summary state
  const [pdTab, setPdTab] = useState("summary");
  const [pdExpanded, setPdExpanded] = useState(false);

  // ===== Refs =====
  const specRef = useRef(null);
  const readBoxRef = useRef(null);
  const audioRef = useRef(null);
  const relRowRef = useRef(null);

  // Author follow modal/state
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authorFollowers, setAuthorFollowers] = useState(0);
  const [rolePicked, setRolePicked] = useState("");

  // “Want to read” dropdown + toast
  const [showReadBox, setShowReadBox] = useState(false);
  const [readStatus, setReadStatus] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "" });

  // Reviews UI
  const [expanded, setExpanded] = useState({});
  const [votes, setVotes] = useState({});
  const [bump, setBump] = useState({});
  const [feedbackToast, setFeedbackToast] = useState({ open: false, type: "", msg: "" });

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ---------- utils ----------
  const splitSentences = (txt = "") =>
    (txt || "")
      .replace(/\n+/g, " ")
      .trim()
      .split(/(?<=[.!?\u0964\u0965])\s+/)
      .filter(Boolean);

  const makeIntroTail = (txt = "", introCount = 6, tailCount = 4) => {
    const parts = splitSentences(txt);
    if (!parts.length) return { intro: "", tail: "" };
    const intro = parts.slice(0, introCount).join(" ");
    const tail = parts.slice(Math.max(parts.length - tailCount, 0)).join(" ");
    return { intro, tail };
  };

  const pickAudio = (b) =>
    b?.audio || b?.audioSrc || b?.audioLink || b?.audio_clip || b?.audioURL || null;

  const normalize = (b) =>
    !b
      ? null
      : {
          id: b.id,
          title: b.title,
          authors: b.authors || b.author || "Unknown",
          coverImage: b.coverImage || b.image,
          rating: b.rating ?? 0,
          ratingCount: b.ratingCount ?? 0,
          publisher: b.publisher ?? "—",
          publishDate: b.publishDate ?? "",
          category: b.category ?? "General",
          pdfLink: b.pdfLink ?? "#",
          status: b.status,
          image: b.image,
          summary: b.longSummary || b.summary || b.description || "",
          summaryIntro: b.summaryIntro || b.summary_intro || null,
          summaryTail: b.summaryTail || b.summary_tail || null,
          authorPhoto:
            b.authorPhoto ||
            b.author_image ||
            b.authorImage ||
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=240&h=240&fit=crop",
          authorFollowers: Number(b.authorFollowers || b.followers || 16),
          authorBio: b.authorBio || b.author_bio || b.authorStory || "",
          audioSrc: pickAudio(b),
        };

  const bucket = (s) => {
    const v = String(s || "Available").toLowerCase();
    if (v.includes("upcoming") || v.includes("coming")) return "upcoming";
    if (v.includes("out") || v.includes("not available") || v.includes("stock"))
      return "unavailable";
    return "available";
  };

  // === Prefer the clicked book from router state ===
  useEffect(() => {
    const sliderBook = location.state?.fromSlider;

    fetch("/books.json")
      .then((res) => res.json())
      .then((data) => {
        let active = null;

        if (sliderBook && String(sliderBook.id) === String(id)) {
          active = sliderBook;
        } else {
          active = data.find((b) => String(b.id) === String(id)) || null;
        }

        if (active) {
          const n = normalize(active);
          setBookData(n);
          setAuthorFollowers(n.authorFollowers);
        } else {
          setBookData(null);
        }

        const others = (data || [])
          .filter((b) => String(b.id) !== String(id))
          .slice(0, 3)
          .map(normalize)
          .filter(Boolean);
        setRelatedBooks(others);

        const targetCategory = (active?.category ?? "General").toLowerCase();
        const totals = (data || []).reduce(
          (acc, b) => {
            if ((b.category ?? "General").toLowerCase() !== targetCategory) return acc;
            acc[bucket(b.status)] += 1;
            return acc;
          },
          { available: 0, upcoming: 0, unavailable: 0 }
        );
        setStats(totals);
      })
      .catch(() => {});
  }, [id, location.state]);

  // init votes when book changes
  useEffect(() => {
    if (!bookData?.id) return;
    const p = REVIEWS_DB[String(bookData.id)];
    if (p?.reviews) {
      const next = {};
      p.reviews.forEach((r) => {
        next[r.id] = { up: r.helpful || 0, down: 0, my: null };
      });
      setVotes(next);
      setExpanded({});
    } else {
      setVotes({});
      setExpanded({});
    }
  }, [bookData?.id]);

  // close the read box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showReadBox && readBoxRef.current && !readBoxRef.current.contains(e.target)) {
        setShowReadBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReadBox]);

  // ====== Audio DOM event listeners ======
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoaded = () => {
      setDuration(el.duration || 0);
    };
    const onTime = () => {
      setCurTime(el.currentTime || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurTime(0);
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [bookData?.audioSrc]);

  // Reset when audio src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = bookData?.audioSrc || "";
      if (bookData?.audioSrc) audioRef.current.load();
    }
  }, [bookData?.audioSrc]);

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el || !bookData?.audioSrc) return;

    const want = new URL(bookData.audioSrc, window.location.href).href;
    if (el.src !== want) {
      el.src = bookData.audioSrc;
    }

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      if (Number.isNaN(el.duration) || !el.duration) {
        el.load();
      }
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const format = (sec = 0) => {
    if (!isFinite(sec)) return "0:00";
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progress = duration ? Math.min(1, Math.max(0, curTime / duration)) : 0;

  const onSeekClick = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurTime(pct * duration);
  };

  const onSeekKeyDown = (e) => {
    if (!audioRef.current) return;
    if (e.key === "ArrowRight") {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    } else if (e.key === "ArrowLeft") {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ));

  const renderStarsLarge = (val) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.round(val || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ));

  if (!bookData) {
    return (
      <div className="text-center text-gray-600 py-20">
        Loading book details...
      </div>
    );
  }

  const pack = REVIEWS_DB[String(bookData.id)] || null;
  const localReviewCount = pack?.reviews?.length ?? 0;
  const ratingCountDisplay = pack ? localReviewCount : 0;
  const reviewsTextDisplay = pack
    ? localReviewCount > 0
      ? `${localReviewCount} Reviews`
      : "No Reviews"
    : "No Reviews";

  const baseSummary = bookData.summary || "No summary available.";
  const introTail = makeIntroTail(baseSummary);
  const summaryIntro = bookData.summaryIntro ?? introTail.intro;
  const summaryTail = bookData.summaryTail ?? introTail.tail;

  const shelfOptions = [
    { key: "want", label: "Want to read" },
    { key: "current", label: "Currently reading" },
    { key: "read", label: "Read" },
  ];
  const onPickShelf = (opt) => {
    setReadStatus(opt.key);
    setShowReadBox(false);
    setToast({ open: true, msg: `Successfully added: ${opt.label}` });
    setTimeout(() => setToast({ open: false, msg: "" }), 1400);
  };

  const countFor = (stars) =>
    Math.round(((pack?.total || 0) * ((pack?.breakdown?.[stars] || 0) / 100)));

  const vote = (id, dir) => {
    const cur = votes[id] || { up: 0, down: 0, my: null };
    let { up, down, my } = cur;

    if (dir === "up") {
      if (my === "up") {
        up -= 1;
        my = null;
      } else {
        if (my === "down") down -= 1;
        up += 1;
        my = "up";
      }
    } else {
      if (my === "down") {
        down -= 1;
        my = null;
      } else {
        if (my === "up") up -= 1;
        down += 1;
        my = "down";
      }
    }

    const next = { up: Math.max(0, up), down: Math.max(0, down), my };
    setVotes((prev) => ({ ...prev, [id]: next }));

    setBump((p) => ({ ...p, [id]: { ...(p[id] || {}), [dir]: true } }));
    setTimeout(() => {
      setBump((p) => ({ ...p, [id]: { ...(p[id] || {}), [dir]: false } }));
    }, 220);

    const type = my === "up" ? "up" : my === "down" ? "down" : "clear";
    const msg =
      type === "up"
        ? "Marked as Helpful"
        : type === "down"
        ? "Marked as Not Helpful"
        : "Feedback removed";

    setFeedbackToast({ open: true, type, msg });
    clearTimeout(vote._t);
    vote._t = setTimeout(() => setFeedbackToast({ open: false, type: "", msg: "" }), 1700);
  };

  const scrollRel = (dir = 1) => {
    const node = relRowRef.current;
    if (!node) return;
    const step = Math.min(360, node.clientWidth * 0.8);
    node.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="bg-white py-8 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Page grid */}
      <div className="mx-auto max-w-7xl grid gap-8 sm:gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* LEFT COLUMN (cover) */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="w-full max-w-[340px] border border-gray-300 rounded-md p-3 sm:p-4 bg-white">
            <img
              src={bookData.coverImage}
              alt={bookData.title}
              loading="lazy"
              className="w-full h-auto max-h-[460px] object-contain"
            />
          </div>
          {/* Want to read control (kept commented exactly as you had) */}
          {/* <div className="mt-3 w-[340px] max-w-full" ref={readBoxRef}> ... </div> */}
        </div>

        {/* RIGHT COLUMN (book info) */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            {bookData.title}
          </h1>
          <p className="text-gray-600 mt-1 text-base">
            by <span className="text-sky-600 font-medium">{bookData.authors}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {bookData.publisher}, {bookData.publishDate} —{" "}
            <Link
              to="/all-genres"
              state={{ filter: { type: "category", value: bookData.category } }}
              className="text-sky-600 hover:underline"
            >
              {bookData.category}
            </Link>
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {renderStars(bookData.rating)}
            <span className="text-sm text-gray-600 font-semibold shrink-0">
              {ratingCountDisplay} Ratings
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-sm text-gray-500">{reviewsTextDisplay}</span>
          </div>

          {/* Short summary teaser */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Summary of the Book</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
              {baseSummary.split(".")[0] + (baseSummary ? "..." : "")}
              {baseSummary.split(".").length > 1 && (
                <button
                  onClick={() => {
                    setPdTab("summary");
                    setPdExpanded(true); // auto-expand
                    specRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="ml-2 font-semibold hover:underline text-sky-600"
                >
                  Read More
                </button>
              )}
            </p>
          </div>

          {/* Availability + Audio + PDF */}
          <div className="mt-6">
            <span className="text-green-600 font-medium text-sm inline-flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-ping mr-2"></span>
              Available
            </span>

            {/* Audio row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleAudio}
                disabled={!bookData.audioSrc}
                className={`flex items-center gap-2 text-sm ${
                  bookData.audioSrc
                    ? "text-gray-700 hover:text-sky-600"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <PauseCircle className="w-5 h-5" />
                ) : (
                  <PlayCircle className="w-5 h-5" />
                )}
                <span>Audio Clip</span>
              </button>

              {/* Progress bar */}
              <div
                className="w-40 sm:w-56 h-1 bg-gray-200 rounded-full mx-2 sm:mx-3 relative cursor-pointer select-none"
                onClick={onSeekClick}
                onKeyDown={onSeekKeyDown}
                role="slider"
                tabIndex={0}
                aria-valuemin={0}
                aria-valuemax={Math.max(1, Math.floor(duration))}
                aria-valuenow={Math.floor(curTime)}
                aria-label="Seek audio"
              >
                <div
                  className="absolute left-0 top-0 h-full bg-sky-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Timing */}
              <div className="text-xs text-gray-600 min-w-[84px]">
                {format(curTime)} / {format(duration)}
              </div>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={bookData.audioSrc || undefined}
                preload="auto"
                crossOrigin="anonymous"
              />

              <a
                href={bookData.pdfLink}
                download
                className="ml-auto inline-flex items-center gap-1 text-sm text-gray-700 font-semibold border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                PDF
              </a>
            </div>

            {!bookData.audioSrc && (
              <div className="mt-2 text-xs text-gray-500">
                No audio clip provided for this book.
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                // Ensure the exact clicked book is what the form sees
                const current = { ...bookData, quantity: 1 };

                // 1) Put it at the FRONT of borrowedBooks (dedupe by id)
                const list = JSON.parse(localStorage.getItem("borrowedBooks") || "[]")
                  .filter((b) => String(b.id) !== String(current.id));
                const next = [current, ...list];
                localStorage.setItem("borrowedBooks", JSON.stringify(next));

                // 2) Save a dedicated pointer for the form
                localStorage.setItem("borrowNow", JSON.stringify(current));

                // 3) Also pass via router state
                navigate("/fill-up-form", { state: { borrowNow: current } });
              }}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-md w-full sm:w-auto block text-center"
            >
              Borrowed
            </button>
          </div>
        </div>

        {/* ============== SPECIFICATION & SUMMARY ============== */}
        <div ref={specRef} className="lg:col-span-2">
          <div className="mt-10 rounded-lg border border-gray-300 overflow-hidden bg-white">
            <div className="px-4 sm:px-5 py-3">
              <h3 className="text-lg font-bold text-gray-800">Specification &amp; Summary</h3>
            </div>

            <div className="border-t border-gray-300">
              <div className="px-4 sm:px-5 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  {["summary", "spec", "author"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setPdTab(t)}
                      className={`px-3 py-1.5 text-sm rounded-md border ${
                        pdTab === t
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t === "summary" ? "Summary" : t === "spec" ? "Specification" : "Author"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {pdTab === "summary" && (
                  <>
                    {!pdExpanded ? (
                      <>
                        <div className="text-gray-800 text-[15px] leading-7 space-y-4">
                          <div className="relative">
                            <p className="line-clamp-3">{summaryIntro}</p>
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
                          </div>

                          <div className="border-t border-gray-200" />

                          <p className="italic text-gray-700">{summaryTail}</p>
                        </div>

                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setPdExpanded(true)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Show More
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-800 text-[15px] leading-7 whitespace-pre-line">
                          {baseSummary}
                        </div>
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setPdExpanded(false)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Show Less
                          </button>
                        </div>
                      </>
                    )}

                    <div className="mt-4 border-t border-b border-gray-300 py-3">
                      <div className="text-center">
                        <button className="inline-flex items-center gap-2 text-red-500 hover:text-sky-600 text-sm">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-current">
                            <span className="text-[10px] font-bold">i</span>
                          </span>
                          Report incorrect information
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {pdTab === "spec" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Title</span>
                      <div className="font-medium text-gray-800">{bookData.title}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Author</span>
                      <div className="font-medium text-gray-800">{bookData.authors}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Category</span>
                      <div className="font-medium text-gray-800">{bookData.category}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Publisher</span>
                      <div className="font-medium text-gray-800">{bookData.publisher}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Publish Date</span>
                      <div className="font-medium text-gray-800">{bookData.publishDate || "—"}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Rating</span>
                      <div className="font-medium text-gray-800">
                        {(bookData.rating || 0).toFixed ? bookData.rating.toFixed(1) : bookData.rating}
                      </div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Status</span>
                      <div className="font-medium text-gray-800">{bookData.status || "Available"}</div>
                    </div>
                  </div>
                )}

                {pdTab === "author" && (
                  <div className="flex items-start gap-5">
                    <div className="w-32 sm:w-36 shrink-0 text-center mx-auto sm:mx-0">
                      <img
                        src={bookData.authorPhoto}
                        alt={bookData.authors}
                        loading="lazy"
                        className="w-24 h-24 rounded-full object-cover border mx-auto"
                      />
                      <div className="mt-2 text-xs text-gray-600">{authorFollowers} followers</div>
                      <button
                        onClick={() => setShowFollowModal(true)}
                        className={`mt-2 w-24 text-sm font-semibold rounded-full px-3 py-1.5 transition ${
                          isFollowing ? "bg-gray-200 text-gray-700 cursor-default" : "bg-sky-500 text-white hover:bg-sky-600"
                        }`}
                        disabled={isFollowing}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{bookData.authors}</h4>
                      <p className="mt-2 text-[15px] leading-7 text-gray-800 whitespace-pre-line">
                        {bookData.authorBio || "No additional author story provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== REVIEWS & RATINGS ===== */}
        <div className="lg:col-span-2 mt-10">
          <h3 className="text-2xl font-semibold text-gray-900">Reviews and Ratings</h3>
        </div>

        {/* LEFT SIDE: rate + reviews list */}
        <div className="lg:col-span-1">
          <div className="">
            <div className="text-sm text-gray-700 font-semibold">Rate this product</div>
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-gray-300" />
              ))}
            </div>
            <button className="mt-3 inline-flex items-center border border-gray-300 text-sky-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-sky-50">
              Review Write
            </button>
          </div>

          {!pack || pack.total === 0 ? (
            <div className="text-sm text-gray-500 mt-6">No reviews yet for this book.</div>
          ) : (
            <div className="space-y-6 mt-10 sm:mt-20">
              {pack.reviews.map((r) => {
                const isLong = (r.body || "").length > 220;
                const open = !!expanded[r.id];
                const body = !isLong || open ? r.body : r.body.slice(0, 220) + "…";
                const firstLetter = r.name?.trim()?.[0]?.toUpperCase() || "?";
                const v = votes[r.id] || { up: r.helpful || 0, down: 0, my: null };
                return (
                  <article key={r.id} className="border-b border-gray-300 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {firstLetter}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">{r.name}</span>
                          <span className="text-gray-500">, {r.date}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < r.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          {r.verified && (
                            <span className="text-xs text-green-600 border border-green-300 rounded-full px-2 py-0.5">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h5 className="mt-3 font-semibold text-gray-900 break-words">{r.title}</h5>

                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                      {body}{" "}
                      {isLong && (
                        <button
                          onClick={() => setExpanded((s) => ({ ...s, [r.id]: !open }))}
                          className="text-sky-600 font-medium hover:underline"
                        >
                          {open ? "Read less" : "Read More"}
                        </button>
                      )}
                    </p>

                    <div className="mt-3 text-xs text-gray-500">Was this review helpful to you?</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <button
                        onClick={() => vote(r.id, "up")}
                        className={`inline-flex items-center gap-1 rounded border px-3 py-1 transition
                          ${v.my === "up" ? "border-green-500 text-green-700 bg-green-50" : "border-gray-300"}
                          ${bump[r.id]?.up ? "animate-[popVote_.2s_ease-out]" : ""}`}
                      >
                        <ThumbsUp className="w-4 h-4" /> Helpful ({v.up})
                      </button>
                      <button
                        onClick={() => vote(r.id, "down")}
                        className={`inline-flex items-center gap-1 rounded border px-3 py-1 transition
                          ${v.my === "down" ? "border-rose-500 text-rose-700 bg-rose-50" : "border-gray-300"}
                          ${bump[r.id]?.down ? "animate-[popVote_.2s_ease-out]" : ""}`}
                      >
                        <ThumbsDown className="w-4 h-4" /> Not Helpful ({v.down})
                      </button>
                      <span className="ml-2 text-gray-500">
                        {r.helpful} people found this helpful
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Average + bars + sort */}
        <div className="lg:col-span-1">
          {!pack || pack.total === 0 ? null : (
            <div className="mt-6 sm:mt-4 flex items-start gap-6 sm:gap-8">
              <div>
                <div className="text-3xl font-semibold">{(pack.overall ?? 0).toFixed(2)}</div>
                <div className="mt-1 flex">{renderStarsLarge(pack.overall ?? 0)}</div>
                <div className="mt-1 text-xs text-gray-600">
                  {pack.total.toLocaleString()} Ratings and {localReviewCount} Reviews
                </div>
              </div>

              <div className="flex-1 min-w-[180px]">
                <ul className="space-y-1">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <div className="w-14 text-sm flex items-center gap-1 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < s ? "text-orange-400 fill-orange-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="h-2 bg-orange-400 rounded"
                          style={{ width: `${pack.breakdown[s] || 0}%` }}
                        />
                      </div>
                      <div className="w-10 text-right text-sm text-gray-700 shrink-0">{countFor(s)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shrink-0">
                <label className="sr-only" htmlFor="review-sort">Sort reviews</label>
                <select id="review-sort" className="border border-gray-300 text-sm rounded-md px-3 py-1.5 text-gray-700">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Top rated</option>
                  <option>Lowest rated</option>
                </select>
              </div>
            </div>
          )}

          {pack?.images?.length > 0 && (
            <div className="mb-6 mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Reviews with images</h4>
                <button className="text-sm text-sky-600 hover:underline">See all photos</button>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 pr-1 touch-pan-x">
                {pack.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`review-${idx}`}
                    loading="lazy"
                    className="h-24 w-24 object-cover rounded-md flex-shrink-0 border border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==== RELATED BOOKS ==== */}
        <div className="lg:col-span-2">
          <div className="mt-10 rounded-lg border border-gray-300 overflow-hidden bg-white">
            <div className="px-4 sm:px-5 py-3 bg-white flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Related Books</h3>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => scrollRel(-1)}
                  className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRel(1)}
                  className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-300 relative bg-white">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />

              <div
                ref={relRowRef}
                className="overflow-x-auto no-scrollbar touch-pan-x"
                aria-label="Related books scroller"
              >
                <div className="flex items-stretch gap-5 p-3 sm:p-4 snap-x snap-mandatory">
                  {relatedBooks.map((b) => (
                    <BookCard
                      key={b.id}
                      book={{
                        id: b.id,
                        title: b.title,
                        image: b.coverImage || b.image,
                        category: b.category || "General",
                        status: b.status || "Available",
                      }}
                      variant="row"
                      size="scroller"
                      status={b.status || "Available"}
                      onClick={() => navigate(`/book/${b.id}`)}
                      onReadThisBook={() => navigate(`/book/${b.id}`)}
                    />
                  ))}
                </div>
              </div>

              <div className="sm:hidden absolute inset-y-0 left-1 flex items-center">
                <button
                  onClick={() => scrollRel(-1)}
                  className="p-2 rounded-md border border-gray-300 bg-white/90 hover:bg-white shadow"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="sm:hidden absolute inset-y-0 right-1 flex items-center">
                <button
                  onClick={() => scrollRel(1)}
                  className="p-2 rounded-md border border-gray-300 bg-white/90 hover:bg-white shadow"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast for shelf add */}
      {toast.open && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-[60] bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-[toastPop_.22s_ease-out]">
          {toast.msg}
        </div>
      )}

      {/* Helpful / Unhelpful popup */}
      {feedbackToast.open && (
        <div className="fixed bottom-8 right-6 z-[70] animate-[slideIn_.22s_ease-out]">
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-3 w/[290px]">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full
                ${feedbackToast.type === "up" ? "bg-green-50 text-green-600" : feedbackToast.type === "down" ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500"}`}
              >
                {
                  feedbackToast.type === "up" ? (
                    <ThumbsUp className="w-4 h-4" />
                  ) : feedbackToast.type === "down" ? (
                    <ThumbsDown className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )
                }
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{feedbackToast.msg}</div>
                <div className="text-xs text-gray-600">Thanks for your feedback.</div>
              </div>
              <button
                onClick={() => setFeedbackToast({ open: false, type: "", msg: "" })}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="mt-3 h-0.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-sky-500 origin-left animate-[bar_1.6s_linear]"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pop { 0% { transform: scale(.95); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        @keyframes toastPop { 0% { transform: translate(-50%, 8px); opacity: 0 } 100% { transform: translate(-50%, 0); opacity: 1 } }
        @keyframes popVote { 0% { transform: scale(.96) } 60% { transform: scale(1.06) } 100% { transform: scale(1) } }
        @keyframes slideIn { 0% { transform: translateY(10px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
        @keyframes bar { 0% { transform: scaleX(1) } 100% { transform: scaleX(0) } }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .touch-pan-x { touch-action: pan-x; }
      `}</style>
    </div>
  );
}
