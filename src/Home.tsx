import { useEffect, useState } from 'react';
import { ROWS, UNTESTED, count, longest, yearLabel } from './engine';
import { VERDICT, type Verdict } from './data/tests';
import { Rich } from './Rich';

const ORDER: Verdict[] = ['confirmed', 'cond', 'literal', 'refuted'];
/** How far the scale tips: level when science agrees, hard toward the discovery when it refutes. */
const TILT: Record<Verdict, number> = { confirmed: 0, cond: 7, literal: -11, refuted: -16 };

/** The scale of the laboratory: a saying on one pan, a discovery on the other, the verdict as a stamp on the post. */
export default function Home({ open, openUntested, go }: { open: (id: string) => void; openUntested: () => void; go: (v: 'tests' | 'wait') => void }) {
  const [only, setOnly] = useState<Verdict | null>(null);
  const [paused, setPaused] = useState(false);
  const list = only ? ROWS.filter((r) => r.verdict === only) : ROWS;
  const [i, setI] = useState(0);
  const r = list[i % list.length];
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => x + 1), 4200);
    return () => clearInterval(t);
  }, [paused, only]);
  const stand = count('confirmed') + count('cond') + count('literal');
  const L = longest();
  const tilt = TILT[r.verdict];
  const W = 1000, H = 560, CX = 500, PY = 170, ARM = 330;

  return (
    <main className="app-main home">
      <section className="h-hero">
        <p className="h-kicker">אמירה במבחן המדע · {ROWS.length} מבחנים · 38 תרבויות · 424 גילויים</p>
        <h1 className="h-title"><span className="num">{stand}</span> מתוך <span className="num">{ROWS.length}</span> פתגמים <mark className="insight">עמדו במבחן</mark></h1>
        <p className="h-explain"><Rich text={`אבל **${count('cond')}** מהם רק בתנאי. כל פתגם הוא **השערה** שעברה בעל פה מאות שנים. כאן היא פוגשת **ניסוי**, עם מקור.`} /></p>
        <div className="h-tones">
          <p className="h-tone t-problem"><b>בעיה</b><span>פתגם נשמע כמו אמת. לכל פתגם יש גם פתגם הפוך, ואיש לא בדק מי צודק.</span></p>
          <p className="h-tone t-solution"><b>פתרון</b><span>כל פתגם מול גילוי מתועד. העובדה בירוק, הפרשנות בכתום, ולכל פסק תחום תוקף.</span></p>
          <p className="h-tone t-insight"><b>תובנה</b><span><mark className="insight">החוכמה העממית צודקת, אבל רק בתנאי שהיא לא אומרת.</mark></span></p>
        </div>
        <div className="h-cta">
          <button className="btn press go" onClick={() => go('tests')}>לכל המבחנים</button>
          <button className="btn press" onClick={() => go('wait')}>כמה זמן חיכו</button>
        </div>
      </section>

      <section className="h-stage" aria-label="מאזני המעבדה" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <svg className="obj scale" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img">
          <line x1="80" x2={W - 80} y1={H - 40} y2={H - 40} className="table" />
          <path d={`M${CX - 70},${H - 40} L${CX},${H - 70} L${CX + 70},${H - 40} Z`} className="post" />
          <rect x={CX - 5} y={PY} width="10" height={H - 70 - PY} className="post" />
          <g className="arm" style={{ transform: `rotate(${tilt}deg)`, transformOrigin: `${CX}px ${PY}px` }}>
            <rect x={CX - ARM} y={PY - 5} width={ARM * 2} height="10" className="beam-bar" />
            {/* the saying, on the right pan */}
            <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${CX + ARM}px ${PY}px` }}>
              <line x1={CX + ARM} x2={CX + ARM - 140} y1={PY} y2={PY + 150} className="chain" />
              <line x1={CX + ARM} x2={CX + ARM + 140} y1={PY} y2={PY + 150} className="chain" />
              <path d={`M${CX + ARM - 160},${PY + 150} Q${CX + ARM},${PY + 215} ${CX + ARM + 160},${PY + 150} Z`} className="pan" />
              <foreignObject x={CX + ARM - 165} y={PY + 30} width="330" height="118">
                <div className="pan-text say" dir="rtl" key={r.id}>
                  <span className="pan-l">הפתגם{r.s.year !== null ? ` · ${yearLabel(r.s.year)}` : ''}</span>
                  <span className="pan-say">"{r.s.he}"</span>
                </div>
              </foreignObject>
            </g>
            {/* the discovery, on the left pan */}
            <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${CX - ARM}px ${PY}px` }}>
              <line x1={CX - ARM} x2={CX - ARM - 140} y1={PY} y2={PY + 150} className="chain" />
              <line x1={CX - ARM} x2={CX - ARM + 140} y1={PY} y2={PY + 150} className="chain" />
              <path d={`M${CX - ARM - 160},${PY + 150} Q${CX - ARM},${PY + 215} ${CX - ARM + 160},${PY + 150} Z`} className="pan disc" />
              <foreignObject x={CX - ARM - 165} y={PY + 30} width="330" height="118">
                <div className="pan-text" dir="rtl" key={r.id}>
                  <span className="pan-l">הגילוי · {yearLabel(r.d[0].y)}</span>
                  <span className="pan-disc">{r.d[0].who.map((w) => w.he).join(' ו')}</span>
                  <span className="pan-t">{r.d[0].t}</span>
                </div>
              </foreignObject>
            </g>
          </g>
          <circle cx={CX} cy={PY} r="14" className="pivot" />
          <foreignObject x={CX - 120} y={PY + 46} width="240" height="120">
            <button className={`stamp-btn v-${r.verdict}`} key={r.id + 'v'} onClick={() => open(r.id)} dir="rtl">
              <span className={`stamp big v-${r.verdict}`}>{VERDICT[r.verdict].he}</span>
            </button>
          </foreignObject>
        </svg>
        <p className="scale-line" key={r.id + 'l'}><Rich text={r.line} /> <button className="link-btn" onClick={() => open(r.id)}>לפסק המלא</button></p>
        <div className="h-legend">
          {ORDER.map((v) => (
            <button key={v} className={`lg chip press vc v-${v} ${only === v ? 'is-on' : ''}`} aria-pressed={only === v} onClick={() => { setOnly(only === v ? null : v); setI(0); }}>
              <i className={`sw stamp-mini v-${v}`} />{VERDICT[v].he} <span className="num">{count(v)}</span>
            </button>
          ))}
          <span className="lg dim-note">המאזניים מתאזנים כשהמדע מסכים, ונוטים אל הגילוי כשהוא מפריך. ריחוף עוצר.</span>
        </div>
      </section>

      <nav className="h-cards" aria-label="מפת התוכן">
        <button className="h-card press" onClick={() => go('tests')}>
          <p className="label">01 · המבחנים</p><strong>פתגם מול גילוי, עם פסק</strong><span className="d">עובדה, פרשנות וכלל הכרעה.</span>
          <span className="num h-card-n">{ROWS.length}</span>
        </button>
        <button className="h-card press" onClick={() => go('wait')}>
          <p className="label">02 · כמה זמן חיכו</p><strong>מהפתגם ועד הניסוי</strong><span className="d">{L ? `"${L.s.he}" חיכתה הכי הרבה.` : ''}</span>
          <span className="num h-card-n">{L ? L.wait!.toLocaleString('he-IL') : ''}</span>
        </button>
        <button className="h-card press" onClick={openUntested}>
          <p className="label">03 · לא נבדק</p><strong>מחלוקות שעוד מחכות לגילוי</strong><span className="d">חור במאגר, לא כישלון של הפתגם.</span>
          <span className="num h-card-n">{UNTESTED.length}</span>
        </button>
      </nav>

      <section className="h-museum" aria-label="שכבת ידע">
        <figure className="h-quote">
          <span className="label">ציטוט</span>
          <blockquote>"שום דבר אינו מופלא מכדי להיות אמת, אם הוא מתיישב עם חוקי הטבע."</blockquote>
          <figcaption className="src">מייקל פאראדיי Michael Faraday, יומן המעבדה, 19 במרץ 1849. תרגום חופשי.</figcaption>
        </figure>
        <div className="h-haiku">
          <span className="label">הייקו</span>
          <p>אלפיים שנה</p><p>הטיפה על האבן</p><p>ודרווין רושם</p>
        </div>
        <div className="h-city">
          <span className="label">דוגמה מהעיר</span>
          <p>"רחוק מהעין, רחוק מהלב" הוא מבחן לתכנון: גינה שכונתית בלי שביל אליה נשכחת. סופרים מבקרים <strong>לפני השביל ואחריו</strong>, והפתגם הופך לנתון.</p>
        </div>
      </section>
      <p className="h-foot">השראה: יומני המעבדה של מייקל פאראדיי Michael Faraday, שבהם כל ניסוי קיבל פסקה ממוספרת.</p>
    </main>
  );
}
