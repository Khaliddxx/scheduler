/**
 * Terms of service and privacy policy, as structured content.
 *
 * ============================= READ THIS =============================
 * BOTH DOCUMENTS BELOW ARE TEMPLATES. No lawyer has read them. They were
 * written to be *structurally* right for this specific business — a managed
 * deployment that holds OAuth tokens for other people's social accounts,
 * stores their content, bills through a third-party processor and runs on a
 * third-party host — because an empty or obviously generic policy fails
 * platform app review, and app review is on the critical path to launch.
 *
 * Structurally right is not the same as enforceable. Before launch:
 *   1. fill `legal.entity`, `legal.jurisdiction` and `legal.address` in
 *      packages/brand/brand.json — every unset one renders as a visible
 *      highlighted placeholder, by design, so it cannot ship unnoticed;
 *   2. have both documents reviewed against the law of that jurisdiction;
 *   3. reconcile the sub-processor list with what you actually run.
 * =====================================================================
 *
 * Why the odd shape: sections are data, not markup, so the two pages share one
 * renderer, the numbering cannot drift, and a lawyer's revisions land in this
 * file instead of inside JSX.
 *
 * `[[token]]` markers are substituted by components/legal/legal-doc.tsx. A token
 * whose brand value is set renders as plain text; one that is unset renders as a
 * loud placeholder.
 */
import { brand } from '@scheduler/brand';
import { TRIAL_DAYS } from '@/content/pricing';

/* ------------------------------------------------------------------ */
/* Placeholders                                                        */
/* ------------------------------------------------------------------ */

export type PlaceholderKey = 'entity' | 'jurisdiction' | 'address';

export interface Placeholder {
  /** Resolved value from brand.json. Empty means "not decided yet". */
  value: string;
  /** What is printed, loudly, when the value is empty. */
  label: string;
}

export const placeholders: Record<PlaceholderKey, Placeholder> = {
  entity: {
    value: brand.legal.entity ?? '',
    label: 'LEGAL ENTITY NAME NOT SET',
  },
  jurisdiction: {
    value: brand.legal.jurisdiction ?? '',
    label: 'JURISDICTION NOT SET',
  },
  address: {
    value: brand.legal.address ?? '',
    label: 'REGISTERED ADDRESS NOT SET',
  },
};

export const unresolvedPlaceholders: PlaceholderKey[] = (
  Object.keys(placeholders) as PlaceholderKey[]
).filter((k) => placeholders[k].value.length === 0);

/* ------------------------------------------------------------------ */
/* Document model                                                      */
/* ------------------------------------------------------------------ */

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'steps'; items: string[] }
  | { kind: 'sub'; heading: string; text: string };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  /** Page `<h1>`. */
  title: string;
  /** Meta description for the route. */
  description: string;
  /** Printed under the title. The date the draft was written, not approved. */
  drafted: string;
  /** One or two paragraphs before the numbered sections begin. */
  intro: string[];
  sections: LegalSection[];
}

/** Printed in the notice panel at the top of both documents. */
export const TEMPLATE_NOTICE = {
  eyebrow: 'Not legal advice',
  title: 'This document is a template that no lawyer has reviewed.',
  body:
    'It was drafted to be structurally correct for this service and detailed enough to pass a social platform’s app review, which requires a live, reachable policy. It has not been checked by a qualified lawyer, it is not tailored to any jurisdiction, and it must be reviewed and completed before this site takes money or handles anyone’s account. Highlighted text marks a detail that is still unset.',
  /** Shown only while `unresolvedPlaceholders` is non-empty. */
  placeholderHint:
    'Unset details are highlighted below. Fill them in packages/brand/brand.json.',
} as const;

const DRAFTED = '11 October 2026';

/* ------------------------------------------------------------------ */
/* Terms of service                                                    */
/* ------------------------------------------------------------------ */

export const terms: LegalDocument = {
  title: 'Terms of service',
  description: `The agreement between you and the operator of ${brand.name}: what the service is, how billing and trials work, what you may and may not publish through it, and where liability sits.`,
  drafted: DRAFTED,
  intro: [
    `These terms govern your use of ${brand.name} (the “Service”), a hosted social media scheduling and publishing service operated by [[entity]] (“we”, “us”). By creating an account, connecting a social account, or using the Service in any way, you agree to them. If you are agreeing on behalf of a company, you confirm you are authorised to bind it.`,
    `Read section 4 and section 6 closely. They cover what happens when you ask us to publish on your behalf to a platform whose rules we do not control — which is the part of this Service most likely to affect you.`,
  ],
  sections: [
    {
      heading: 'Who we are and what these terms cover',
      blocks: [
        {
          kind: 'p',
          text: `The Service is operated by [[entity]], registered at [[address]]. You can reach us at ${brand.supportEmail}.`,
        },
        {
          kind: 'p',
          text: 'These terms, together with our privacy policy, form the whole agreement between you and us about the Service. If we publish a separate agreement for a dedicated instance or an enterprise plan, that agreement takes precedence where the two conflict.',
        },
      ],
    },
    {
      heading: 'What the Service is',
      blocks: [
        {
          kind: 'p',
          text: `${brand.name} is a managed, hosted deployment of ${brand.upstream.project}, an open-source publishing engine licensed under ${brand.upstream.licence}. We operate, configure, brand, monitor, upgrade, back up and support that software and the infrastructure it runs on, and we hold the platform application registrations it uses to publish on your behalf.`,
        },
        {
          kind: 'p',
          text: 'What you are buying is the operation of that software as a service, not a licence to the underlying code — the code is already available to you under its own licence. Your rights to the source, and what self-hosting it yourself would involve, are set out on our open source page.',
        },
        {
          kind: 'p',
          text: 'We may change, add to or remove features of the Service. Where a change materially reduces functionality you are paying for, we will tell you before it takes effect and you may cancel under section 8.',
        },
      ],
    },
    {
      heading: 'Your account',
      blocks: [
        {
          kind: 'p',
          text: 'You must be at least 18 years old, or the age of majority where you live, to hold an account. You are responsible for the accuracy of the details you give us and for everything that happens under your account.',
        },
        {
          kind: 'list',
          items: [
            'Keep your credentials confidential and do not share a single login between people — invite them as team members instead.',
            'Tell us promptly at the support address above if you believe your account has been accessed without your authorisation.',
            'You are responsible for the acts and omissions of anyone you invite into your workspace, including clients and contractors.',
            'We may refuse to create, or may close, an account where we reasonably believe it exists to breach these terms or a platform’s rules.',
          ],
        },
      ],
    },
    {
      heading: 'Connected social accounts and platform rules',
      blocks: [
        {
          kind: 'p',
          text: 'To publish for you, the Service needs you to connect your accounts on third-party platforms. When you do, you authorise us to access and act on those accounts on your instruction, within the permissions you granted, for as long as the connection remains in place.',
        },
        {
          kind: 'sub',
          heading: 'You must have the right to connect the account',
          text: 'You confirm that you own each connected account or are authorised by its owner to publish to it. Connecting a client’s account without their permission is a breach of these terms and, usually, of that platform’s terms too.',
        },
        {
          kind: 'sub',
          heading: 'Each platform’s own terms still apply to you',
          text: 'Every platform has its own terms, acceptable use rules, automation policies and rate limits. Those agreements are between you and that platform. Using our Service does not change them, and nothing we do can override them.',
        },
        {
          kind: 'sub',
          heading: 'We cannot guarantee a platform will accept a post',
          text: 'Platforms change their APIs, revoke tokens, impose limits, deprecate endpoints, reject content and suspend accounts, often without warning or explanation. We will retry a failed publish and surface the platform’s error to you, but we are not responsible for a platform refusing, delaying, altering or removing your content, or for a platform suspending your account.',
        },
        {
          kind: 'sub',
          heading: 'Disconnection',
          text: 'You may disconnect any account at any time, from the Service or from the platform’s own settings. Disconnecting revokes our access and cancels anything still scheduled to that channel.',
        },
      ],
    },
    {
      heading: 'Your content',
      blocks: [
        {
          kind: 'p',
          text: 'Everything you upload, draft, schedule or publish through the Service stays yours. We claim no ownership of it.',
        },
        {
          kind: 'p',
          text: 'You grant us a non-exclusive, worldwide, royalty-free licence to host, copy, transmit, adapt the format of, and display your content strictly as needed to operate the Service for you — storing a draft, re-encoding a video for a platform’s requirements, cropping an image per network, publishing on your schedule, and showing it back to you and to the team members you invited. That licence exists only for those purposes and ends when the content is deleted, subject to the retention periods in our privacy policy.',
        },
        {
          kind: 'p',
          text: 'We do not use your content to train machine learning models, and we do not sell it or share it for advertising.',
        },
        {
          kind: 'p',
          text: 'You are responsible for having the rights to what you publish, including rights to images, video, music and anything generated with the help of an AI feature.',
        },
      ],
    },
    {
      heading: 'Acceptable use',
      blocks: [
        {
          kind: 'p',
          text: 'You may not use the Service to do any of the following, and we may suspend or terminate an account that does:',
        },
        {
          kind: 'list',
          items: [
            'Publish unlawful content, or content that infringes someone else’s intellectual property, privacy or publicity rights.',
            'Publish content that is harassing, hateful, threatening, sexually exploitative of minors, or that incites violence.',
            'Send spam, engage in coordinated inauthentic behaviour, operate bulk fake or bought accounts, or artificially inflate engagement.',
            'Breach the terms, developer policies or automation rules of any connected platform, or do anything that puts our platform application registrations at risk.',
            'Attempt to circumvent plan limits, rate limits or channel caps, or share one workspace’s capacity across unrelated businesses to avoid paying for it.',
            'Probe, scan, overload or reverse engineer the hosted Service, or attempt to access another customer’s workspace or data.',
            'Resell or white-label the Service other than as the plan you are on expressly permits.',
          ],
        },
        {
          kind: 'p',
          text: 'Where conduct on your account threatens a shared platform application registration — which, on the shared plans, every other customer depends on — we may suspend publishing immediately and tell you afterwards. We will restore it as soon as the risk is resolved.',
        },
      ],
    },
    {
      heading: 'Plans, trials, fees and renewal',
      blocks: [
        {
          kind: 'p',
          text: `Plans, their prices and what each includes are set out on our pricing page. Every plan starts with a ${TRIAL_DAYS}-day trial. We ask for a payment method at sign-up so the workspace continues without interruption when the trial ends.`,
        },
        {
          kind: 'list',
          items: [
            `Unless you cancel before the trial ends, the plan you chose is charged at the end of the ${TRIAL_DAYS}-day trial and then renews automatically each billing period until cancelled.`,
            'Fees are charged in advance, in the currency shown at checkout, and are stated exclusive of any sales tax, VAT or GST, which is added where applicable.',
            'Payments are handled by our third-party payment processor on its own hosted checkout. We do not receive or store your full card details.',
            'An upgrade takes effect immediately and is charged pro rata for the rest of the period. A downgrade takes effect at the end of the current period.',
            'If a payment fails we will retry it and contact you. Publishing may be paused while an account is in arrears.',
            'We may change prices for future billing periods with at least 30 days’ notice. The price of a period already paid for does not change.',
          ],
        },
        {
          kind: 'p',
          text: `Fees already paid are non-refundable except where the law requires otherwise, or where we agree otherwise in writing. The ${TRIAL_DAYS}-day trial exists so you can evaluate the Service before paying for it.`,
        },
      ],
    },
    {
      heading: 'Cancellation, suspension and termination',
      blocks: [
        {
          kind: 'p',
          text: 'You may cancel at any time. Cancellation stops the next renewal; the workspace stays available until the end of the period you have already paid for.',
        },
        {
          kind: 'p',
          text: 'We may suspend or terminate your access if you materially breach these terms, if your account puts a platform registration or other customers at risk, if required by law or by a platform, or if fees go unpaid after notice. Where circumstances allow, we will give you notice and an opportunity to put the breach right first.',
        },
        {
          kind: 'p',
          text: 'After termination we disconnect your channels and delete the stored platform tokens. Your content and workspace data are retained for a short grace period so an accidental cancellation can be undone, then deleted, as set out in our privacy policy. You can export your posts, media and channel list before you go, and you should, because we cannot restore data after that window closes.',
        },
      ],
    },
    {
      heading: 'Channel limits and fair use',
      blocks: [
        {
          kind: 'p',
          text: 'Each plan includes a number of connected channels, where one channel is one account on one network — a personal profile and a company page on the same network are two channels. Only channels connected at a given moment count, so you may disconnect one and connect another.',
        },
        {
          kind: 'p',
          text: 'Posting volume is not metered, but the Service is subject to fair use: automated or programmatic use that degrades the Service for others, or that exceeds what a platform permits for our application registration, may be rate limited. We will contact you before taking any action that stops your posts going out, unless the problem is urgent.',
        },
      ],
    },
    {
      heading: 'API, webhooks, agents and automation',
      blocks: [
        {
          kind: 'p',
          text: 'The Service exposes a REST API, outbound webhooks, a command-line interface and a Model Context Protocol server. API credentials are yours to protect; anything done with your credentials is treated as done by you.',
        },
        {
          kind: 'p',
          text: 'That includes anything published by an AI agent or automation you connect. If an agent drafts and publishes a post, you are the publisher of it. We default agent output to a draft that needs your approval; if you turn that off, you accept the consequences of what goes out.',
        },
        {
          kind: 'p',
          text: 'Interfaces may change. We will give reasonable notice of a breaking change to a documented, stable interface, and we may change an interface marked experimental at any time.',
        },
      ],
    },
    {
      heading: 'Availability, maintenance and support',
      blocks: [
        {
          kind: 'p',
          text: 'We work to keep the Service available and we monitor it, but the shared plans are provided without a contractual uptime commitment. A dedicated instance can carry one; it is set out in that plan’s own agreement.',
        },
        {
          kind: 'p',
          text: 'We will carry out planned maintenance at quiet times where we can, and we will announce it in advance where it is likely to interrupt publishing. Scheduled posts that fall inside an outage are published when the Service recovers, which may be later than the time you set.',
        },
        {
          kind: 'p',
          text: `Support is provided by email at ${brand.supportEmail}, in English, during business hours, with priority response on the plans that include it.`,
        },
      ],
    },
    {
      heading: 'Third parties we depend on',
      blocks: [
        {
          kind: 'p',
          text: 'Delivering this Service means relying on other companies. Our current sub-processors — hosting and managed databases, the payment processor, transactional email, and the AI model providers behind the optional drafting and image features — are listed in our privacy policy and on our sub-processors page, which we keep current.',
        },
        {
          kind: 'p',
          text: 'The social platforms themselves are not our sub-processors. They are independent services you have your own relationship with, and we act on your instruction when we publish to them.',
        },
      ],
    },
    {
      heading: 'Intellectual property',
      blocks: [
        {
          kind: 'p',
          text: `The underlying scheduling engine is ${brand.upstream.project}, licensed ${brand.upstream.licence} by its own authors, and your rights to it come from that licence rather than from us. We are not affiliated with, endorsed by or sponsored by that project or its maintainers.`,
        },
        {
          kind: 'p',
          text: `Our name, logo, site copy, design and the configuration and operational work around the engine are ours. Nothing in these terms transfers them to you, and a plan that permits white-labelled client reports permits exactly that and no more.`,
        },
        {
          kind: 'p',
          text: 'Names and logos of the social platforms belong to those platforms. We use them only to say which networks the Service can publish to, which implies no partnership or endorsement.',
        },
        {
          kind: 'p',
          text: 'If you send us feedback or a feature suggestion, we may act on it without obligation or payment to you. We will not claim your content as ours in doing so.',
        },
      ],
    },
    {
      heading: 'Disclaimers',
      blocks: [
        {
          kind: 'p',
          text: 'To the fullest extent the law allows, the Service is provided as it is and as available, without warranties of any kind, whether express or implied, including any implied warranties of merchantability, fitness for a particular purpose or non-infringement.',
        },
        {
          kind: 'p',
          text: 'We do not warrant that the Service will be uninterrupted or error free, that every scheduled post will be accepted by its platform, that analytics returned by a platform are accurate or complete, or that output from an AI feature is accurate, original or suitable for publication. Review AI output before it goes out.',
        },
        {
          kind: 'p',
          text: 'Nothing in these terms excludes liability that cannot lawfully be excluded, including for death or personal injury caused by negligence, or for fraud. Where you deal with us as a consumer, your statutory rights are unaffected.',
        },
      ],
    },
    {
      heading: 'Limitation of liability',
      blocks: [
        {
          kind: 'p',
          text: 'To the fullest extent the law allows, neither party is liable to the other for lost profits, lost revenue, lost goodwill, lost or corrupted data, or any indirect or consequential loss, however caused.',
        },
        {
          kind: 'p',
          text: 'Our total liability arising out of or in connection with the Service, in contract, tort (including negligence) or otherwise, is limited in aggregate to the greater of the fees you paid us in the twelve months before the event giving rise to the claim, or one hundred US dollars.',
        },
        {
          kind: 'p',
          text: 'This section does not limit liability that cannot lawfully be limited.',
        },
      ],
    },
    {
      heading: 'Indemnity',
      blocks: [
        {
          kind: 'p',
          text: 'You agree to indemnify us against claims, losses and reasonable costs arising from content you published through the Service, from your breach of these terms or of a platform’s terms, or from your connecting an account you were not authorised to connect.',
        },
      ],
    },
    {
      heading: 'Changes to these terms',
      blocks: [
        {
          kind: 'p',
          text: 'We may update these terms. For a material change we will give at least 30 days’ notice by email or in the application before it takes effect. Continuing to use the Service after that date means you accept the updated terms; if you do not, cancel before it takes effect and we will refund any unused prepaid period.',
        },
      ],
    },
    {
      heading: 'Governing law and disputes',
      blocks: [
        {
          kind: 'p',
          text: 'These terms, and any dispute arising out of them or out of the Service, are governed by the law of [[jurisdiction]], and the courts of [[jurisdiction]] have exclusive jurisdiction, except that a consumer may bring proceedings in the courts of their place of residence where the law gives them that right.',
        },
        {
          kind: 'p',
          text: 'Before starting proceedings, please write to us. Most problems are faster to fix than to litigate.',
        },
      ],
    },
    {
      heading: 'General',
      blocks: [
        {
          kind: 'list',
          items: [
            'If any provision of these terms is held unenforceable, the rest continues in force.',
            'A failure to enforce a provision is not a waiver of it.',
            'You may not assign these terms without our consent. We may assign them to a successor in connection with a merger, acquisition or sale of assets, on notice to you.',
            'Neither party is liable for a failure to perform caused by an event beyond its reasonable control, for as long as that event lasts.',
            'There are no third-party beneficiaries to these terms.',
          ],
        },
      ],
    },
    {
      heading: 'Contact',
      blocks: [
        {
          kind: 'p',
          text: `Questions about these terms go to ${brand.supportEmail}, or to [[entity]], [[address]].`,
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Privacy policy                                                     */
/* ------------------------------------------------------------------ */

export const privacy: LegalDocument = {
  title: 'Privacy policy',
  description: `How ${brand.name} handles your data: what we collect, how social account access tokens are stored and deleted, who our sub-processors are, and how to exercise your rights.`,
  drafted: DRAFTED,
  intro: [
    `This policy explains what personal data ${brand.name} collects, why, who it is shared with, and what you can ask us to do about it. It covers the ${brand.name} website and the hosted application.`,
    'The part most people want is section 5: what happens to the access tokens for the social accounts you connect. It is also the part social platforms examine during app review, so it is written plainly rather than defensively.',
  ],
  sections: [
    {
      heading: 'Who is responsible for your data',
      blocks: [
        {
          kind: 'p',
          text: `The controller of the personal data described here is [[entity]], [[address]]. Privacy questions, including requests to exercise your rights, go to ${brand.supportEmail}.`,
        },
        {
          kind: 'p',
          text: 'Where you use the Service to publish on behalf of your own clients, you are the controller of your clients’ data and we act as your processor for it. Our processing instructions are these terms and your use of the Service; a separate data processing agreement is available on request.',
        },
      ],
    },
    {
      heading: 'What we collect',
      blocks: [
        {
          kind: 'sub',
          heading: 'Account and workspace data',
          text: 'Your name, email address, password hash, workspace and team member names, roles and invitations, and your plan and its limits.',
        },
        {
          kind: 'sub',
          heading: 'Content you put into the Service',
          text: 'Drafts, scheduled and published posts, captions, comments, uploaded images and video, AI prompts you submit, approval notes, and the publishing schedule itself.',
        },
        {
          kind: 'sub',
          heading: 'Connected social accounts',
          text: 'For each channel you connect: the platform, the account or page identifier, the display name and avatar the platform returns, the permission scopes you granted, and the access and refresh tokens needed to publish. See section 5.',
        },
        {
          kind: 'sub',
          heading: 'Performance data returned by platforms',
          text: 'Aggregate metrics for posts we published for you — impressions, reactions, comments, clicks, follower counts — fetched from each platform’s analytics API so the Service can show them back to you.',
        },
        {
          kind: 'sub',
          heading: 'Billing data',
          text: 'Your plan, billing period, billing email, invoice history, country for tax purposes, and the payment processor’s customer and subscription identifiers. Card numbers are entered on the processor’s own hosted checkout and never reach our servers.',
        },
        {
          kind: 'sub',
          heading: 'Technical and usage data',
          text: 'IP address, browser and device type, pages viewed, actions taken in the application, API requests, and server, queue and error logs. Logs are how a failed publish gets diagnosed.',
        },
        {
          kind: 'sub',
          heading: 'Support correspondence',
          text: 'What you write to us and our replies, including anything you choose to attach.',
        },
        {
          kind: 'p',
          text: 'We do not ask for, and ask you not to send us, special category data — health, biometrics, political opinions, religious beliefs, sexual orientation, or trade union membership.',
        },
      ],
    },
    {
      heading: 'Why we process it, and on what basis',
      blocks: [
        {
          kind: 'list',
          items: [
            'To provide the Service you asked for — creating your account, storing drafts, publishing on schedule, fetching analytics, running approvals. Basis: performance of our contract with you.',
            'To take payment and keep accounts. Basis: performance of our contract, and compliance with tax and accounting law.',
            'To support you and answer your messages. Basis: performance of our contract, and our legitimate interest in running a usable service.',
            'To keep the Service secure, prevent abuse, detect fraud, and protect our platform application registrations. Basis: our legitimate interests, and legal obligation where applicable.',
            'To understand which features are used and fix what breaks, using aggregate and pseudonymised data where that is enough. Basis: legitimate interests.',
            'To send service announcements about outages, breaking changes and policy updates. Basis: performance of our contract.',
            'To send marketing email about the product. Basis: consent, which you may withdraw at any time, and every such email carries an unsubscribe link.',
            'To comply with law, and to establish or defend legal claims. Basis: legal obligation and legitimate interests.',
          ],
        },
        {
          kind: 'p',
          text: 'Optional AI drafting and image generation are processed on the basis of your request each time you use the feature. You can use the Service without using them.',
        },
      ],
    },
    {
      heading: 'Cookies and analytics',
      blocks: [
        {
          kind: 'p',
          text: 'The application sets a first-party session cookie to keep you signed in, and a small number of first-party preference cookies. These are strictly necessary for the Service to function and are not used for advertising.',
        },
        {
          kind: 'p',
          text: 'We do not run third-party advertising or cross-site tracking, and we do not sell personal data or share it for behavioural advertising. Fonts are served from our own domain, so loading a page does not call out to a font provider. Where we use product analytics, it is configured without third-party advertising identifiers, and its provider appears on our sub-processors page.',
        },
      ],
    },
    {
      heading: 'Social account access: tokens, scopes and platform data',
      blocks: [
        {
          kind: 'p',
          text: 'When you connect a channel, the platform redirects you to its own consent screen, you approve the permissions, and the platform returns an access token to us. We never see or ask for your password on any platform.',
        },
        {
          kind: 'list',
          items: [
            'We request the narrowest scopes that let us do what you asked — publish content, read back the metrics for content we published, and list the pages or accounts you administer so you can choose which to connect.',
            'Tokens are encrypted at rest, held only in our application database and its backups, and are never written to application logs, exposed in the API, or shared with another customer.',
            'We use a connected account only to carry out actions you or your team scheduled or approved, and to fetch metrics for posts published through the Service.',
            'We do not read your private messages, we do not scrape your followers, we do not use platform data to build profiles, we do not sell it, we do not use it for advertising, and we do not use it to train machine learning models.',
            'On the shared plans, publishing goes through our own platform application registrations. Your tokens remain yours and are scoped to your account; a shared registration does not give any other customer access to your channels.',
            'Disconnect a channel and we revoke the token with the platform where its API allows it, and delete our copy. You can also revoke our access from the platform’s own app or security settings at any time, which immediately stops us publishing there.',
          ],
        },
        {
          kind: 'p',
          text: 'Platform data obtained through a platform API is also handled according to that platform’s developer terms, including any requirement to delete it on request or when your connection ends. Where a platform’s rules are stricter than this policy, the stricter rule applies.',
        },
      ],
    },
    {
      heading: 'AI features',
      blocks: [
        {
          kind: 'p',
          text: 'If you use AI drafting or image generation, the prompt you write and the context needed to answer it are sent to a third-party model provider to generate a response. Those providers appear on our sub-processors page.',
        },
        {
          kind: 'p',
          text: 'We use these providers under terms that do not permit them to train their models on our customers’ inputs or outputs, and we do not train models on your content ourselves. Generated output is returned to your workspace as a draft; nothing is published without the approval your workspace is configured to require.',
        },
      ],
    },
    {
      heading: 'Who we share data with',
      blocks: [
        {
          kind: 'p',
          text: 'We do not sell personal data. We share it only with service providers who process it on our instructions, under contract, and only as far as their service requires:',
        },
        {
          kind: 'list',
          items: [
            'Cloud hosting and managed database providers, which run the application and store its data and backups.',
            'Our payment processor, which handles checkout, card data, subscriptions and invoices. Card details go directly to them.',
            'A transactional email provider, for account, billing and service notification email.',
            'AI model providers, for the optional drafting and image features described above.',
            'Error monitoring and logging providers, which may incidentally process technical data contained in an error report.',
          ],
        },
        {
          kind: 'p',
          text: 'We also disclose data where the law requires it, to a platform where its developer terms oblige us to, to professional advisers under a duty of confidence, and to a buyer or successor if the business is sold — in which case we will tell you before your data is transferred.',
        },
        {
          kind: 'p',
          text: 'A current sub-processor list, with each provider’s role and location, is maintained on our sub-processors page. We will give notice of a new sub-processor before it starts processing customer data.',
        },
      ],
    },
    {
      heading: 'International transfers',
      blocks: [
        {
          kind: 'p',
          text: 'Our providers may process data outside the country where you live, including in the United States. Where data leaves the UK or the European Economic Area, we rely on an adequacy decision where one covers the transfer, and otherwise on standard contractual clauses together with an assessment of the safeguards in place.',
        },
        {
          kind: 'p',
          text: 'A dedicated instance can be provisioned in a chosen region where data residency matters to you.',
        },
      ],
    },
    {
      heading: 'How long we keep it',
      blocks: [
        {
          kind: 'list',
          items: [
            'Account, workspace and content data: for as long as your account is open.',
            'After you close your account or we terminate it: a short grace period so an accidental cancellation can be reversed, then deletion from live systems. Backups age out on their own rotation shortly after.',
            'Social account tokens: deleted when you disconnect the channel or close the account, whichever is first, and revoked with the platform where its API supports revocation.',
            'Billing records and invoices: for as long as tax and company law requires, which is commonly six to seven years, even after the account closes.',
            'Server, security and publishing logs: a short rolling window, kept because that is how an incident is investigated.',
            'Support correspondence: while it is needed to help you and to defend any related claim.',
          ],
        },
        {
          kind: 'p',
          text: 'You can ask for earlier deletion under section 11, and we will comply unless we are required to keep something, in which case we will tell you what and why.',
        },
      ],
    },
    {
      heading: 'How we protect it',
      blocks: [
        {
          kind: 'list',
          items: [
            'Encryption in transit over TLS, and encryption at rest for the database, its backups, and stored platform tokens.',
            'Access to production systems limited to the people who operate them, over individual accounts with multi-factor authentication.',
            'Separation between customer workspaces, enforced by the application, and isolated instances on dedicated plans.',
            'Nightly backups with restores tested rather than assumed.',
            'Signed, timestamped webhooks, verified before the payload is parsed, so an inbound event cannot be forged or replayed.',
            'Dependency and platform updates tracked against the upstream project we deploy.',
          ],
        },
        {
          kind: 'p',
          text: 'No service is perfectly secure. If a breach affects your personal data and the law requires it, we will notify you and the relevant supervisory authority within the statutory deadline, and tell you what happened and what to do.',
        },
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        {
          kind: 'p',
          text: 'Depending on where you live, you have some or all of the following rights over your personal data:',
        },
        {
          kind: 'list',
          items: [
            'Access — a copy of the data we hold about you.',
            'Rectification — correction of data that is wrong or incomplete.',
            'Erasure — deletion, where we have no overriding obligation to keep it.',
            'Portability — your data in a structured, machine-readable format, including an export of your posts, media and channel list.',
            'Restriction and objection — to limit or object to processing based on legitimate interests, including profiling.',
            'Withdrawal of consent — at any time, where we relied on consent, without affecting processing already carried out.',
            'Non-discrimination — we will not degrade your service because you exercised a right.',
          ],
        },
        {
          kind: 'p',
          text: `To exercise any of these, write to ${brand.supportEmail} from the address on your account. We will respond within one month and may ask for information to confirm it is really you. You can also complain to the data protection authority where you live, and in [[jurisdiction]] in particular; we would rather you came to us first.`,
        },
      ],
    },
    {
      heading: 'Children',
      blocks: [
        {
          kind: 'p',
          text: 'The Service is for business use and is not directed at children. We do not knowingly collect data from anyone under 18. If you believe a child has given us data, write to us and we will delete it.',
        },
      ],
    },
    {
      heading: 'Automated decision-making',
      blocks: [
        {
          kind: 'p',
          text: 'We do not make decisions about you by automated means that have a legal or similarly significant effect. Automated systems do flag suspected abuse and failed payments for a human to look at, and AI features generate content at your request, which is not a decision about you.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          kind: 'p',
          text: 'We will update this policy as the Service changes. The date at the top shows when the current version was written, and we will notify you by email or in the application before a change that materially affects how we use your data takes effect.',
        },
      ],
    },
    {
      heading: 'Contact',
      blocks: [
        {
          kind: 'p',
          text: `Write to ${brand.supportEmail}, or to [[entity]], [[address]]. If we have appointed a data protection officer or an EU or UK representative, their details will appear here.`,
        },
      ],
    },
  ],
};
