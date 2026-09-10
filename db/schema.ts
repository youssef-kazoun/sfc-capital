import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
};

// ------------------------- USERS -------------------------

export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "ANALYST", "SUPPORT", "CUSTOMER"] })
    .notNull()
    .default("CUSTOMER"),
  phone: text("phone"),
  locale: text("locale").notNull().default("en"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

// ------------------------- MARKET DATA -------------------------

export const stocks = pgTable("stocks", {
  id: id(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  exchange: text("exchange").notNull().default("EGX"),
  sector: text("sector"),
  logoUrl: text("logo_url"),
  currency: text("currency").notNull().default("EGP"),
  lastPrice: real("last_price").notNull().default(0),
  changePct: real("change_pct").notNull().default(0),
  volume: integer("volume").notNull().default(0),
  marketCap: real("market_cap"),
  ...timestamps,
});

export const priceHistory = pgTable("price_history", {
  id: id(),
  stockId: text("stock_id")
    .notNull()
    .references(() => stocks.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  volume: integer("volume").notNull(),
});

// ------------------------- NEWS -------------------------

export const newsArticles = pgTable("news_articles", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull().default("General"),
  published: boolean("published").notNull().default(false),
  publishedAt: text("published_at"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const newsArticleStocks = pgTable(
  "news_article_stocks",
  {
    newsId: text("news_id")
      .notNull()
      .references(() => newsArticles.id, { onDelete: "cascade" }),
    stockId: text("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.newsId, t.stockId] }) })
);

// ------------------------- RECOMMENDATIONS -------------------------

export const recommendations = pgTable("recommendations", {
  id: id(),
  stockId: text("stock_id")
    .notNull()
    .references(() => stocks.id),
  action: text("action", {
    enum: ["BUY", "SELL", "HOLD", "ACCUMULATE", "REDUCE"],
  }).notNull(),
  entryPrice: real("entry_price").notNull(),
  targetPrice: real("target_price").notNull(),
  stopLoss: real("stop_loss").notNull(),
  status: text("status", { enum: ["OPEN", "CLOSED", "EXPIRED"] })
    .notNull()
    .default("OPEN"),
  rationale: text("rationale").notNull(),
  rationaleAr: text("rationale_ar"),
  riskLevel: text("risk_level").notNull().default("Medium"),
  timeHorizon: text("time_horizon").notNull().default("Medium-term"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  closedAt: text("closed_at"),
  closePrice: real("close_price"),
  ...timestamps,
});

export const recommendationUpdates = pgTable("recommendation_updates", {
  id: id(),
  recommendationId: text("recommendation_id")
    .notNull()
    .references(() => recommendations.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

// ------------------------- ANALYSIS -------------------------

export const analyses = pgTable("analyses", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Technical"),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  stockId: text("stock_id").references(() => stocks.id),
  chartImage: text("chart_image"),
  published: boolean("published").notNull().default(false),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

// ------------------------- USER PORTFOLIO -------------------------

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stockId: text("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  }
);

export const portfolioItems = pgTable("portfolio_items", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stockId: text("stock_id")
    .notNull()
    .references(() => stocks.id),
  quantity: real("quantity").notNull(),
  avgBuyPrice: real("avg_buy_price").notNull(),
  ...timestamps,
});

export const alerts = pgTable("alerts", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stockId: text("stock_id")
    .notNull()
    .references(() => stocks.id, { onDelete: "cascade" }),
  condition: text("condition", { enum: ["ABOVE", "BELOW"] }).notNull(),
  targetPrice: real("target_price").notNull(),
  triggered: boolean("triggered").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

// ------------------------- SUBSCRIPTIONS / PAYMENTS -------------------------

export const packages = pgTable("packages", {
  id: id(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  priceMonthly: real("price_monthly").notNull(),
  priceYearly: real("price_yearly").notNull(),
  features: text("features").notNull(), // JSON-encoded string array
  isActive: boolean("is_active").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const subscriptions = pgTable("subscriptions", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  packageId: text("package_id")
    .notNull()
    .references(() => packages.id),
  status: text("status", {
    enum: ["ACTIVE", "CANCELED", "EXPIRED", "PENDING"],
  })
    .notNull()
    .default("PENDING"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  startedAt: text("started_at").notNull().default(sql`(current_timestamp)`),
  endsAt: text("ends_at"),
});

export const payments = pgTable("payments", {
  id: id(),
  subscriptionId: text("subscription_id")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("EGP"),
  status: text("status", {
    enum: ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED"],
  })
    .notNull()
    .default("PENDING"),
  provider: text("provider").notNull().default("mock"),
  providerRef: text("provider_ref"),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

// ------------------------- SUPPORT -------------------------

export const tickets = pgTable("tickets", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  status: text("status", {
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
  })
    .notNull()
    .default("OPEN"),
  priority: text("priority").notNull().default("Normal"),
  ...timestamps,
});

export const ticketMessages = pgTable("ticket_messages", {
  id: id(),
  ticketId: text("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  userId: text("user_id").references(() => users.id),
  handled: boolean("handled").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

// ------------------------- SETTINGS / AUDIT -------------------------

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const auditLogs = pgTable("audit_logs", {
  id: id(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  meta: text("meta"),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});
