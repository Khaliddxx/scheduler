/**
 * Frequently asked questions.
 *
 * Two sets: the general set on the home page and a billing-focused set on the
 * pricing page. Answers deliberately tell the truth about what this product is —
 * a managed deployment of an open-source engine — because the licence requires a
 * source offer anyway and a buyer who discovers it later churns angrier.
 * See docs/06-agpl-compliance.md.
 */

export interface Faq {
  q: string;
  /** Plain text, or simple inline markup resolved by the Faq component. */
  a: string;
}

export const homeFaqs: Faq[] = [
  {
    q: 'What does this actually do?',
    a: 'You connect your social accounts once, write a post in one place, and it publishes to every network you chose, at the time you set. A visual calendar shows everything scheduled, and analytics come back per post so you can see what worked.',
  },
  {
    q: 'Which networks are supported?',
    a: 'Twenty-five networks including X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Threads, Bluesky, Mastodon, Pinterest, Reddit, Discord, Slack and Telegram, plus blogging destinations like Medium, DEV.to, Hashnode and WordPress.',
  },
  {
    q: 'Can an AI agent post for me?',
    a: 'Yes. There is an MCP server, a CLI and a public REST API, so any assistant that speaks MCP can draft and schedule on your behalf. Agent output arrives as a draft by default, so nothing publishes without your say-so unless you turn that off.',
  },
  {
    q: 'Can I cross-post the same content everywhere?',
    a: 'Yes, and you can override the wording per network, because what reads well on LinkedIn rarely reads well on X. Media is re-cropped per network automatically.',
  },
  {
    q: 'Do you support teams and clients?',
    a: 'On Studio and above you get unlimited team members, roles and an approval step. On Agency each client gets a separate workspace with its own channels and reporting.',
  },
  {
    q: 'What happens to posts if something fails?',
    a: 'A failed publish is retried and then surfaced in the calendar with the platform error attached, so you can fix and requeue it rather than discovering a silent gap a week later.',
  },
  {
    q: 'Is this built on open-source software?',
    a: 'Yes, and we are upfront about it: the scheduling engine is an AGPL-3.0 open-source project, which we run, brand, host, back up and support as a managed service. You are paying for the operation of it, not for the code. The source of the version we run is published — the link is in the footer.',
  },
  {
    q: 'Then why not self-host it myself?',
    a: 'You can, and if you enjoy running Postgres, Redis, a queue worker and a backup schedule, you probably should. What you would still have to do yourself is register and get approved for a developer app on every social platform you want to post to, which is the part that takes weeks. That is most of what you are buying here.',
  },
  {
    q: 'Can I export my data and leave?',
    a: 'Yes. Your posts, media and connected-channel list export on request, and because the engine is open source there is a documented path to running the same thing yourself.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every plan starts with a 7-day trial. You will be asked for a card so the workspace can continue without interruption, and you can cancel inside the trial without being charged.',
  },
];

export const pricingFaqs: Faq[] = [
  {
    q: 'What counts as a channel?',
    a: 'One account on one network. A LinkedIn personal profile and a LinkedIn company page are two channels. Three Facebook pages are three channels.',
  },
  {
    q: 'Can I swap channels after connecting them?',
    a: 'Yes. Disconnect one and connect another; only the number connected at any one time counts against your plan.',
  },
  {
    q: 'What happens when the trial ends?',
    a: 'The card on file is charged for the plan you picked and the workspace carries on. Cancel before the trial ends and nothing is charged.',
  },
  {
    q: 'Can I change plan later?',
    a: 'Up or down at any time. Upgrades take effect immediately and are prorated; downgrades take effect at the end of the current period.',
  },
  {
    q: 'What is the difference between shared and dedicated?',
    a: 'On the shared plans your workspace runs alongside others on managed infrastructure. On Dedicated you get your own isolated instance — your own database, your own storage, your own resources — so nothing you do contends with another customer. Both connect to the social networks through our platform app registrations, because that is the model the networks themselves require.',
  },
  {
    q: 'Do I need my own social app credentials?',
    a: 'You almost certainly do not. The networks are explicit that a single registered application is the intended way to publish on behalf of many customers — TikTok rules out the one-app-per-customer model outright. We hold and maintain those registrations so you never deal with an app review. If you have a specific regulatory reason to need your own, talk to us before buying.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'The 7-day trial exists so you can decide before paying. If something is broken on our side and we cannot fix it, write to us and we will sort it out.',
  },
  {
    q: 'Which payment methods do you take?',
    a: 'Card payments, handled by our payment processor. We never see or store your card details.',
  },
  {
    q: 'Do you charge for social platform app approval?',
    a: 'No. We hold the platform registrations and absorb the API costs and the review process, on every plan. That is a large part of what the subscription pays for.',
  },
];
