function SeasoningIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 30 Q30 24 40 30 Q50 36 60 30" />
      <path d="M20 43 Q30 37 40 43 Q50 49 60 43" />
      <path d="M20 56 Q30 50 40 56 Q50 62 60 56" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="25" />
      <line x1="40" y1="18" x2="40" y2="40" />
      <line x1="40" y1="40" x2="56" y2="50" />
      <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="18" y="12" width="44" height="56" rx="4" />
      <polyline points="26,28 31,34 40,22" />
      <line x1="45" y1="28" x2="56" y2="28" />
      <polyline points="26,43 31,49 40,37" />
      <line x1="45" y1="43" x2="56" y2="43" />
      <polyline points="26,58 31,64 40,52" />
      <line x1="45" y1="58" x2="56" y2="58" />
    </svg>
  );
}

function SpoonIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="40" cy="24" rx="13" ry="15" />
      <path d="M40 39 Q44 55 40 70" />
    </svg>
  );
}

function WaterDropIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M40 12 C40 12 18 40 18 53 C18 65 28 72 40 72 C52 72 62 65 62 53 C62 40 40 12 40 12 Z" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M40 68 C26 68 16 58 16 46 C16 34 24 26 27 18 C28 30 35 34 35 34 C34 24 41 12 41 12 C50 24 60 35 60 46 C60 58 54 68 40 68 Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 64 C16 64 20 36 38 24 C52 15 65 22 65 22 C65 22 60 50 42 60 C30 66 16 64 16 64 Z" />
      <line x1="16" y1="64" x2="52" y2="34" />
    </svg>
  );
}

function KnifeIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 62 L58 16 L62 20 L22 66 Z" />
      <path d="M10 68 L18 62 L22 66 L14 74 Z" />
    </svg>
  );
}

function PanIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 52 C14 40 26 34 40 34 C54 34 66 40 66 52 C66 62 54 68 40 68 C26 68 14 62 14 52 Z" />
      <path d="M66 50 L78 44" />
      <path d="M28 28 C26 24 28 20 26 16" />
      <path d="M40 24 C38 20 40 16 38 12" />
      <path d="M52 28 C50 24 52 20 50 16" />
    </svg>
  );
}

const tips = [
  {
    category: "Technique",
    title: "Season in Layers",
    description:
      "Add salt at each cooking stage — not just at the end — for deeper, more complex flavor.",
    Icon: SeasoningIcon,
  },
  {
    category: "Technique",
    title: "Let Meat Rest",
    description:
      "After cooking, rest proteins 5–10 minutes so juices redistribute for a juicier result.",
    Icon: ClockIcon,
  },
  {
    category: "Prep",
    title: "Mise en Place",
    description:
      "Prepare all your ingredients before turning on the heat. A prepared kitchen is a calm kitchen.",
    Icon: ChecklistIcon,
  },
  {
    category: "Flavor",
    title: "Taste as You Cook",
    description:
      "Your palate is your most important tool. Adjust seasoning throughout, not just at the end.",
    Icon: SpoonIcon,
  },
  {
    category: "Tip",
    title: "Save Pasta Water",
    description:
      "A ladleful of starchy pasta water is the secret to silky, restaurant-quality sauces.",
    Icon: WaterDropIcon,
  },
  {
    category: "Technique",
    title: "Preheat Your Pan",
    description:
      "A hot pan before adding oil means better searing, a golden crust, and less sticking.",
    Icon: FlameIcon,
  },
  {
    category: "Flavor",
    title: "Finish with Fresh Herbs",
    description:
      "Add delicate herbs like basil or parsley at the very last moment to preserve their bright flavor.",
    Icon: LeafIcon,
  },
  {
    category: "Safety",
    title: "Keep Your Knife Sharp",
    description:
      "A sharp knife requires less force, giving you more control and a safer, cleaner cut.",
    Icon: KnifeIcon,
  },
  {
    category: "Technique",
    title: "Deglaze for Depth",
    description:
      "Add wine or broth to a hot pan after searing to lift the caramelized bits into a rich sauce.",
    Icon: PanIcon,
  },
];

export default function KitchenTipsGrid() {
  return (
    <>
      {tips.map(({ category, title, description, Icon }, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md shadow-sm border border-stone-200"
        >
          <div className="relative h-56 bg-amber-50 flex items-center justify-center">
            <div className="absolute w-36 h-36 rounded-full bg-amber-200/40" />
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-amber-700/90 rounded-full tracking-wide uppercase">
              {category}
            </span>
            <div className="relative">
              <Icon />
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 tabIndex={0} className="text-base font-serif font-bold text-stone-900 leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
              {title}
            </h3>
            <p tabIndex={0} className="text-sm text-stone-500 mt-1 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
              {description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
