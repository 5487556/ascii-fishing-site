import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BookOpen, Fish, RotateCcw, Waves } from 'lucide-react';
import { useLocalRecords } from './hooks/useLocalRecords';

type Rarity = '常見' | '較稀有' | '稀有';
type FishSpecies = {
  id: string;
  name: string;
  minCm: number;
  maxCm: number;
  rarity: Rarity;
  weight: number;
};
type CatchRecord = { id: string; count: number; maxCm: number };
type Catch = { fish: FishSpecies; sizeCm: number };
type Phase = 'idle' | 'fishing' | 'reeling' | 'caught';

const SPECIES: FishSpecies[] = [
  { id: 'carp', name: '鯉魚', minCm: 20, maxCm: 60, rarity: '常見', weight: 9 },
  { id: 'crucian-carp', name: '鯽魚', minCm: 10, maxCm: 35, rarity: '常見', weight: 9 },
  { id: 'grass-carp', name: '草魚', minCm: 30, maxCm: 90, rarity: '常見', weight: 9 },
  { id: 'catfish', name: '鯰魚', minCm: 20, maxCm: 80, rarity: '常見', weight: 9 },
  { id: 'tilapia', name: '吳郭魚', minCm: 15, maxCm: 40, rarity: '常見', weight: 9 },
  { id: 'milkfish', name: '虱目魚', minCm: 25, maxCm: 60, rarity: '常見', weight: 9 },
  { id: 'mullet', name: '鯔魚', minCm: 20, maxCm: 60, rarity: '常見', weight: 9 },
  { id: 'mackerel', name: '鯖魚', minCm: 20, maxCm: 45, rarity: '常見', weight: 9 },
  { id: 'sardine', name: '沙丁魚', minCm: 10, maxCm: 25, rarity: '常見', weight: 9 },
  { id: 'hairtail', name: '白帶魚', minCm: 30, maxCm: 100, rarity: '常見', weight: 9 },
  { id: 'eel', name: '日本鰻', minCm: 25, maxCm: 80, rarity: '常見', weight: 9 },
  { id: 'snakehead', name: '鱧魚', minCm: 30, maxCm: 80, rarity: '常見', weight: 9 },
  { id: 'sea-bass', name: '金目鱸', minCm: 25, maxCm: 100, rarity: '較稀有', weight: 3 },
  { id: 'salmon', name: '大西洋鮭', minCm: 50, maxCm: 100, rarity: '較稀有', weight: 3 },
  { id: 'rainbow-trout', name: '虹鱒', minCm: 25, maxCm: 60, rarity: '較稀有', weight: 3 },
  { id: 'chub-mackerel', name: '花腹鯖', minCm: 25, maxCm: 50, rarity: '較稀有', weight: 3 },
  { id: 'skipjack', name: '正鰹', minCm: 40, maxCm: 100, rarity: '較稀有', weight: 3 },
  { id: 'yellowtail', name: '日本鰤', minCm: 40, maxCm: 100, rarity: '較稀有', weight: 3 },
  { id: 'red-seabream', name: '真鯛', minCm: 20, maxCm: 70, rarity: '較稀有', weight: 3 },
  { id: 'grouper', name: '青斑', minCm: 25, maxCm: 100, rarity: '較稀有', weight: 3 },
  { id: 'flounder', name: '日本比目魚', minCm: 20, maxCm: 60, rarity: '較稀有', weight: 3 },
  { id: 'barracuda', name: '大梭魚', minCm: 50, maxCm: 150, rarity: '較稀有', weight: 3 },
  { id: 'tuna', name: '大目鮪', minCm: 60, maxCm: 200, rarity: '較稀有', weight: 3 },
  { id: 'dorado', name: '鬼頭刀', minCm: 50, maxCm: 120, rarity: '稀有', weight: 1 },
  { id: 'ocean-sunfish', name: '翻車魚', minCm: 60, maxCm: 300, rarity: '稀有', weight: 1 },
  { id: 'whale-shark', name: '鯨鯊', minCm: 100, maxCm: 600, rarity: '稀有', weight: 1 },
  { id: 'swordfish', name: '劍旗魚', minCm: 100, maxCm: 300, rarity: '稀有', weight: 1 },
  { id: 'bluefin-tuna', name: '太平洋黑鮪', minCm: 100, maxCm: 300, rarity: '稀有', weight: 1 },
  { id: 'anglerfish', name: '鮟鱇魚', minCm: 20, maxCm: 90, rarity: '稀有', weight: 1 },
  { id: 'giant-grouper', name: '龍膽石斑', minCm: 40, maxCm: 200, rarity: '稀有', weight: 1 },
  { id: 'rohu', name: '印度鯉', minCm: 30, maxCm: 80, rarity: '常見', weight: 9 },
  { id: 'loach', name: '泥鰍', minCm: 8, maxCm: 20, rarity: '常見', weight: 9 },
  { id: 'anchovy', name: '日本鯷', minCm: 5, maxCm: 15, rarity: '常見', weight: 9 },
  { id: 'bluegill', name: '藍鰓太陽魚', minCm: 10, maxCm: 30, rarity: '常見', weight: 9 },
  { id: 'yellow-perch', name: '黃鱸', minCm: 15, maxCm: 45, rarity: '常見', weight: 9 },
  { id: 'horse-mackerel', name: '竹筴魚', minCm: 15, maxCm: 40, rarity: '常見', weight: 9 },
  { id: 'silver-carp', name: '白鰱', minCm: 30, maxCm: 100, rarity: '常見', weight: 9 },
  { id: 'golden-pompano', name: '金鯧', minCm: 20, maxCm: 60, rarity: '常見', weight: 9 },
  { id: 'walleye', name: '玻璃梭鱸', minCm: 25, maxCm: 80, rarity: '較稀有', weight: 3 },
  { id: 'tiger-puffer', name: '虎河豚', minCm: 20, maxCm: 60, rarity: '較稀有', weight: 3 },
  { id: 'sturgeon', name: '歐洲鱘', minCm: 100, maxCm: 300, rarity: '稀有', weight: 1 },
  { id: 'blacktip-reef-shark', name: '黑鰭礁鯊', minCm: 100, maxCm: 200, rarity: '稀有', weight: 1 },
  { id: 'giant-freshwater-stingray', name: '巨型淡水魟', minCm: 100, maxCm: 400, rarity: '稀有', weight: 1 },
];

type Zone = { width: number; end: number; label: string; score: number; className: string };
const ZONE_TYPES = [
  { width: 22, label: '失手', score: -1, className: 'zone--miss' },
  { width: 21, label: '擦邊', score: 1, className: 'zone--near' },
  { width: 14, label: '正中', score: 3, className: 'zone--hit' },
  { width: 21, label: '擦邊', score: 1, className: 'zone--near' },
  { width: 22, label: '失手', score: -1, className: 'zone--miss' },
];

function createZones(): Zone[] {
  const shuffled = [...ZONE_TYPES];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  let end = 0;
  return shuffled.map((zone) => {
    end += zone.width;
    return { ...zone, end };
  });
}

const SCENE: Record<Phase, string[]> = {
  idle: [
    '       *        .       *',
    '    _/\\_    _.._    _/\\_',
    '   /    \\__/    \\__/    \\',
    '       .-""""-.',
    '      /  o  o  \\       /|',
    '      \\   __   /      / |__________',
    '       |\\____/|      /  |           \\',
    '       /|    |\\_____/   |            o',
    '      /_|____|_\\    /   |____________/',
    '   __/           \\__/                 ',
    '  /                                   \\',
    ' ~~~^~~~~ ~~~~^~~~~~~ ~~~~^~~~~ ~~~~~~~',
    '   ><((*>      ><((*>       ><((*>',
    ' ~~~~~~~ ~~~~ ~~~~~~~~ ~~~~ ~~~~~~~~~~',
  ],
  fishing: [
    '       *        .       *',
    '    _/\\_    _.._    _/\\_',
    '   /    \\__/    \\__/    \\',
    '       .-""""-.',
    '      /  o  o  \\       /|',
    '      \\   __   /      / |__________',
    '       |\\____/|      /  |           \\',
    '       /|    |\\_____/   |           *o',
    '      /_|____|_\\    /   |____________/',
    '   __/           \\__/                 ',
    '  /                                   \\',
    ' ~~~ ~~~^~~~ ~~~~~~ ~~^~~~ ~~~~~~~~~~~~',
    '   ><((*>      ><((*>       ><((*>',
    ' ~~~~~~~ ~~~~ ~~~~~~~~ ~~~~ ~~~~~~~~~~',
  ],
  reeling: [
    '       *        .       *',
    '    _/\\_    _.._    _/\\_',
    '   /    \\__/    \\__/    \\',
    '       .-""""-.',
    '      /  o  o  \\       /|',
    '      \\   __   /      / |__________',
    '       |\\____/|      /  |       _-\\',
    '       /|    |\\_____/   |___.-` ><((*>',
    '      /_|____|_\\    /   |____________/',
    '   __/           \\__/      * SPLASH! ',
    '  /                                   \\',
    ' ~~~^~~~~~ ~~~ SPLASH! ~~~~^~~~~~~~~~~~',
    '   ><((*>       *        ><((*>',
    ' ~~~~~~~ ~~~~ ~~~~~~~~ ~~~~ ~~~~~~~~~~',
  ],
  caught: [
    '       *        .       *',
    '    _/\\_    _.._    _/\\_',
    '   /    \\__/    \\__/    \\',
    '       .-""""-.',
    '      /  o  o  \\       /|',
    '      \\   __   /      / |__________',
    '       |\\____/|      /  |       _-\\',
    '       /|    |\\_____/   |      ><((*>',
    '      /_|____|_\\    /   |____________/',
    '   __/           \\__/                  ',
    '  /                                   \\',
    ' ~~~^~~~~ ~~~~^~~~~~~ ~~~~^~~~~ ~~~~~~~',
    '   ><((*>      ><((*>       ><((*>',
    ' ~~~~~~~ ~~~~ ~~~~~~~~ ~~~~ ~~~~~~~~~~',
  ],
};

const FISH_IDS = new Set(SPECIES.map((fish) => fish.id));
const FISH_SHAPES = ['><>', '><((*>', '><(((*>', '<*))><'];

function isCatchRecord(value: unknown): value is CatchRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    FISH_IDS.has(record.id) &&
    Number.isInteger(record.count) &&
    (record.count as number) > 0 &&
    typeof record.maxCm === 'number' &&
    Number.isFinite(record.maxCm) &&
    record.maxCm > 0
  );
}

function chooseFish(): FishSpecies {
  const totalWeight = SPECIES.reduce((sum, fish) => sum + fish.weight, 0);
  let draw = Math.random() * totalWeight;
  for (const fish of SPECIES) {
    draw -= fish.weight;
    if (draw < 0) return fish;
  }
  return SPECIES[SPECIES.length - 1];
}

function pickZone(position: number, zones: Zone[]) {
  return zones.find((zone) => position < zone.end) ?? zones[zones.length - 1];
}

export default function App() {
  const [records, setRecords, storageError] = useLocalRecords<CatchRecord>(
    'ascii-fishing:field-guide:v1',
    [],
    isCatchRecord,
  );
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(16);
  const [zones, setZones] = useState<Zone[]>(ZONE_TYPES.map((zone, index) => ({
    ...zone,
    end: ZONE_TYPES.slice(0, index + 1).reduce((sum, item) => sum + item.width, 0),
  })));
  const [indicator, setIndicator] = useState(0);
  const [cycleDuration, setCycleDuration] = useState(1800);
  const [lastMove, setLastMove] = useState('拋竿後，按下按鈕停住指標。');
  const [currentCatch, setCurrentCatch] = useState<Catch | null>(null);
  const [sceneFrame, setSceneFrame] = useState(0);
  const startedAt = useRef<number | null>(null);
  const initialDirection = useRef(1);
  const discovered = records.length;
  const caughtCount = records.reduce((sum, record) => sum + record.count, 0);

  useEffect(() => {
    if (phase !== 'fishing') return;
    const timer = window.setInterval(() => {
      if (startedAt.current === null) return;
      const cycle = ((performance.now() - startedAt.current) % cycleDuration) / cycleDuration;
      const position = cycle <= 0.5 ? cycle * 200 : (1 - cycle) * 200;
      setIndicator(initialDirection.current === 1 ? position : 100 - position);
    }, 24);
    return () => window.clearInterval(timer);
  }, [phase, cycleDuration]);

  useEffect(() => {
    if (phase !== 'fishing' && phase !== 'reeling') return;
    const timer = window.setInterval(() => setSceneFrame((frame) => (frame + 1) % 2), 500);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'reeling' || !currentCatch) return;
    const timer = window.setTimeout(() => {
      setRecords((previous) => {
        const existing = previous.find((record) => record.id === currentCatch.fish.id);
        if (!existing) {
          return [...previous, { id: currentCatch.fish.id, count: 1, maxCm: currentCatch.sizeCm }];
        }
        return previous.map((record) =>
          record.id === currentCatch.fish.id
            ? {
                ...record,
                count: record.count + 1,
                maxCm: Math.max(record.maxCm, currentCatch.sizeCm),
              }
            : record,
        );
      });
      setPhase('caught');
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [phase, currentCatch, setRecords]);

  function castLine() {
    initialDirection.current = Math.random() < 0.5 ? 1 : -1;
    startedAt.current = performance.now();
    setCycleDuration(1050 + Math.random() * 1450);
    setTargetScore(12 + Math.floor(Math.random() * 9));
    setZones(createZones());
    setScore(0);
    setIndicator(initialDirection.current === 1 ? 0 : 100);
    setCurrentCatch(null);
    setLastMove('指標正在移動，把握時機！');
    setPhase('fishing');
  }

  function stopIndicator() {
    const zone = pickZone(indicator, zones);
    const nextScore = score + zone.score;
    setScore(nextScore);
    setLastMove(`${zone.label}！${zone.score > 0 ? '+' : ''}${zone.score} 良度`);
    if (nextScore < targetScore) return;

    const fish = chooseFish();
    const sizeCm = Math.round((fish.minCm + Math.random() * (fish.maxCm - fish.minCm)) * 10) / 10;
    setCurrentCatch({ fish, sizeCm });
    setLastMove('魚兒上鉤了！正在收線……');
    setPhase('reeling');
  }

  function handleMainAction() {
    if (phase === 'fishing') stopIndicator();
    else castLine();
  }

  function clearRecords() {
    if (records.length === 0) return;
    if (window.confirm('確定清除全部魚類圖鑑紀錄嗎？這個動作無法復原。')) {
      setRecords([]);
      setLastMove('圖鑑紀錄已清除，準備重新出發。');
    }
  }

  const actionLabel =
    phase === 'fishing'
      ? '停住指標'
      : phase === 'reeling'
        ? '收線中…'
        : '拋竿';
  const progressStyle = { '--progress': `${discovered ? (discovered / SPECIES.length) * 100 : 0}%` } as CSSProperties;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="ASCII 釣魚網站首頁">
          <span className="wordmark-mark">&gt;&lt;</span>
          <span>溪邊手札</span>
        </a>
        <a className="topbar-link" href="#field-guide">
          <BookOpen size={17} strokeWidth={1.8} />
          <span>魚類圖鑑</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="hero-kicker"><Waves size={16} /> 一場不趕時間的垂釣</div>
          <h1 id="page-title">ASCII<br />釣魚網站</h1>
          <p>聽水聲，等浮標。每次收線，都可能遇見一位新的水中旅人。</p>
          <div className="hero-note">
            <span className="note-line" />
            <span>手氣決定魚種，手感累積良度。</span>
          </div>
        </div>
        <div className={`river-scene river-scene--${phase}`} aria-label="ASCII 釣魚動畫">
          <div className="scene-topline">
            <span>河岸觀察站</span>
            <span className="scene-live"><span />{phase === 'fishing' ? '浮標移動中' : phase === 'reeling' ? '魚兒上鉤' : '水面平靜'}</span>
          </div>
          <pre className={`scene-art scene-art--${phase} scene-frame--${sceneFrame}`} aria-hidden="true">
            {SCENE[phase].join('\n')}
          </pre>
          <div className="scene-caption">
            <span className="scene-fish-mark">{phase === 'reeling' || phase === 'caught' ? FISH_SHAPES[1] : '><>'}</span>
            <span>{phase === 'caught' && currentCatch ? `${currentCatch.fish.name} 已入簿` : '一竿一世界，慢慢等就好。'}</span>
          </div>
        </div>
      </section>

      <section className="game-panel" aria-labelledby="game-title">
        <div className="game-main">
          <div className="section-heading">
            <span className="section-icon"><Fish size={19} /></span>
            <div>
              <h2 id="game-title">溪流挑戰</h2>
              <p>綠色區域已收窄，隨機門檻為 {targetScore} 點良度。</p>
            </div>
          </div>

          <div className="meter-wrap">
            <div className="meter-topline">
              <span>良度指標</span>
              <span className="score-readout"><strong>{score}</strong><small> / {targetScore}</small></span>
            </div>
            <div
              className={`meter-track ${phase === 'fishing' ? 'meter-track--active' : ''}`}
              role="meter"
              aria-label="良度區域指標"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(indicator)}
            >
              <span className="meter-marker" style={{ left: `${indicator}%` }} />
              {zones.map((zone, index) => (
                <span
                  className={`meter-zone ${zone.className}`}
                  key={`${zone.className}-${index}`}
                  style={{ width: `${zone.width}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="meter-labels" aria-hidden="true">
              <span className="zone-key"><i className="key-dot key-dot--miss" />失手 −1</span>
              <span className="zone-key"><i className="key-dot key-dot--near" />擦邊 +1</span>
              <span className="zone-key"><i className="key-dot key-dot--hit" />正中 +3</span>
            </div>
          </div>

          <div className="action-row">
            <button
              className="cast-button"
              type="button"
              onClick={handleMainAction}
              disabled={phase === 'reeling'}
            >
              {phase !== 'fishing' && <span className="cast-button-glyph">&gt;&gt;</span>}
              {actionLabel}
            </button>
            <p className="game-hint" aria-live="polite">{lastMove}</p>
          </div>
        </div>

        <aside className={`catch-card ${phase === 'caught' ? 'catch-card--ready' : ''}`} aria-live="polite">
          <div className="catch-heading">
            <span>{phase === 'caught' ? '本次漁獲' : '今日收穫'}</span>
            <span className="catch-rule" />
          </div>
          {phase === 'caught' && currentCatch ? (
            <div className="catch-result">
              <span className="catch-fish-art" aria-hidden="true">{FISH_SHAPES[SPECIES.indexOf(currentCatch.fish) % FISH_SHAPES.length]}</span>
              <h3>{currentCatch.fish.name}</h3>
              <p>{currentCatch.fish.rarity}魚種 <span>／</span> {currentCatch.fish.minCm}–{currentCatch.fish.maxCm} cm</p>
              <div className="catch-size">{currentCatch.sizeCm.toFixed(1)} <small>cm</small></div>
              <span className={`rarity-tag rarity-tag--${currentCatch.fish.rarity}`}>{currentCatch.fish.rarity}</span>
            </div>
          ) : (
            <div className="catch-empty">
              <span className="empty-fish" aria-hidden="true">{'><((*>'}</span>
              <p>{phase === 'reeling' ? '魚兒正在靠岸…' : '還沒有魚兒上鉤'}</p>
              <small>{phase === 'reeling' ? '稍等一下，馬上揭曉。' : '累積良度，解鎖你的第一尾魚。'}</small>
            </div>
          )}
        </aside>
      </section>

      <section className="field-guide" id="field-guide" aria-labelledby="guide-title">
        <div className="guide-header">
          <div className="guide-title-group">
            <span className="guide-icon"><BookOpen size={19} /></span>
            <div>
              <h2 id="guide-title">魚類圖鑑</h2>
              <p>認識每一位水中旅人，讓每次相遇留下紀錄。</p>
            </div>
          </div>
          <div className="guide-tools">
            <div className="guide-progress" style={progressStyle}>
              <strong>{discovered}<span> / {SPECIES.length}</span></strong>
              <span className="guide-progress-track"><i /></span>
              <small>已發現</small>
            </div>
            <button
              className="clear-button"
              type="button"
              onClick={clearRecords}
              disabled={records.length === 0 || phase === 'fishing' || phase === 'reeling'}
            >
              <RotateCcw size={14} />清除紀錄
            </button>
          </div>
        </div>

        {storageError && <p className="storage-message" role="status">{storageError}</p>}
        {!storageError && <p className="storage-note">圖鑑紀錄保存在此瀏覽器中。</p>}

        <div className="fish-grid">
          {SPECIES.map((fish, index) => {
            const record = records.find((item) => item.id === fish.id);
            return (
              <article className={`fish-entry ${record ? 'fish-entry--found' : 'fish-entry--unknown'}`} key={fish.id}>
                <span className="fish-entry-number">{String(index + 1).padStart(2, '0')}</span>
                <span className={`fish-entry-shape ${record ? '' : 'fish-entry-shape--unknown'}`} aria-hidden="true">
                  {record ? FISH_SHAPES[index % FISH_SHAPES.length] : '???'}
                </span>
                <h3>{record ? fish.name : '？？？'}</h3>
                {record ? (
                  <>
                    <span className={`fish-rarity fish-rarity--${fish.rarity}`}>{fish.rarity}</span>
                    <p className="fish-entry-meta">最大 {record.maxCm.toFixed(1)} cm</p>
                    <p className="fish-entry-count">遇見 {record.count} 次</p>
                  </>
                ) : (
                  <p className="fish-entry-meta fish-entry-meta--hidden">等待相遇</p>
                )}
              </article>
            );
          })}
        </div>
        <footer className="page-footer">
          <span>今日的河水，也記得你的每一次等待。</span>
          <span>{caughtCount} 尾魚，{discovered} 種相遇</span>
        </footer>
      </section>
    </main>
  );
}
