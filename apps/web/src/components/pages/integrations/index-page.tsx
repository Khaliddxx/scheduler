import Link from 'next/link';
import { brand, registerUrl } from '@scheduler/brand';
import { channelCount } from '@/content/channels';
import { integrations, surfaceTable, type Integration, type IntegrationKind } from '@/content/integrations';
import { plans, TRIAL_DAYS } from '@/content/pricing';
import { AccentScope, Block, ClosingBand, DataTable, FaqList, GuideGrid, Note, OrbitBand, TextLink } from './blocks';
import { PageHero } from './hero';
import { IntegrationMark } from './mark';
import { OutlinePill, PrimaryPill } from './pills';

/**
 * /integrations: no counterpart on the reference site, so it is built from the
 * integration pages' parts. The hero swaps the floating channel tiles for the
 * integrations' own tiles around the site mark; below it, the integrations as
 * guide tiles grouped by how they connect, the channel orbit, the surface
 * table, the developer surfaces, a short FAQ and the closing band.
 */

/** The ten floating-tile slots of the hero, filled with the ten integrations. */
const slots = [
  { left: 4, top: 6, tilt: -8, delay: 0, dur: 6.5, mobile: true },
  { left: 34, top: 0, tilt: 6, delay: 1.2, dur: 7 },
  { left: 62, top: 2, tilt: 6, delay: 0.2, dur: 7.3 },
  { left: 84, top: 10, tilt: 8, delay: 2.1, dur: 6.8, mobile: true },
  { left: 16, top: 32, tilt: -4, delay: 0.6, dur: 6, mobile: true },
  { left: 88, top: 38, tilt: -6, delay: 0.3, dur: 7.4 },
  { left: 2, top: 60, tilt: 5, delay: 1.7, dur: 6.2, mobile: true },
  { left: 90, top: 66, tilt: -7, delay: 0.9, dur: 7.1 },
  { left: 12, top: 86, tilt: 7, delay: 2.5, dur: 6.6, mobile: true },
  { left: 78, top: 88, tilt: -5, delay: 1.4, dur: 6.9, mobile: true },
];

const tileMark = (item: Integration) => (
  <IntegrationMark
    logo={item.logo}
    glyph={item.glyph}
    ring={false}
    className="h-16 w-16 shadow-[0_14px_30px_rgba(10,0,40,0.35)] sm:h-[72px] sm:w-[72px]"
  />
);

const guide = (item: Integration) => ({
  name: item.name,
  href: `/integrations/${item.slug}`,
  blurb: item.blurb,
  mark: <IntegrationMark logo={item.logo} glyph={item.glyph} ring={false} className="h-8 w-8 sm:h-10 sm:w-10" />,
});

const groups: Array<{ kinds: IntegrationKind[]; title: string; intro: string }> = [
  {
    kinds: ['assistant'],
    title: 'AI assistants',
    intro:
      'Assistants connect to the MCP server with a workspace API key. Ask in plain language; what they write lands in the calendar as a draft for you to approve.',
  },
  {
    kinds: ['automation', 'feed'],
    title: 'Automation tools and feeds',
    intro:
      'Automation tools create posts through the public API and hear back through signed webhooks. Feeds are read directly: every new item becomes a post.',
  },
];

const devSurfaces = [
  { name: 'MCP server', href: '/developers#mcp', blurb: 'For any assistant that speaks MCP', mark: <IntegrationMark logo="mcp" ring={false} className="h-8 w-8 sm:h-10 sm:w-10" /> },
  { name: 'Public API', href: '/developers#api', blurb: 'Everything the calendar does, over JSON', mark: <IntegrationMark glyph="code" ring={false} className="h-8 w-8 sm:h-10 sm:w-10" /> },
  { name: 'Webhooks', href: '/developers#webhooks', blurb: 'Signed events when posts go out, or fail', mark: <IntegrationMark glyph="zap" ring={false} className="h-8 w-8 sm:h-10 sm:w-10" /> },
  { name: 'Command line', href: '/developers#cli', blurb: 'One command from a terminal or CI job', mark: <IntegrationMark logo="terminal" ring={false} className="h-8 w-8 sm:h-10 sm:w-10" /> },
];

const starter = plans.find((p) => p.monthly > 0) ?? plans[0];

const faq = [
  {
    question: 'Do integrations cost extra?',
    answer: `No. The MCP server, public API, command line, webhooks and RSS auto-posting are on every plan. Plans start at $${starter.monthly} a month for ${starter.channels} channels, after a ${TRIAL_DAYS}-day trial.`,
  },
  {
    question: 'Which assistants can connect?',
    answer:
      'Any MCP client: desktop assistants, editors, or your own agent loop. Claude, ChatGPT, Codex, Cursor and Gemini each have a setup page, and Claude Code drives the command line.',
  },
  {
    question: 'Will an assistant publish without asking me?',
    answer:
      'No. Agent output lands as a draft by default, and nothing an agent writes publishes until a person approves it, unless you turn that off deliberately.',
  },
  {
    question: 'Do I need to write code?',
    answer:
      'Not for assistants or feeds: an assistant needs the server URL and a key, and a feed needs its URL. Automation tools call the public API from their own HTTP steps.',
  },
  {
    question: 'What can an integration see?',
    answer:
      'Only the workspace its key belongs to. An agency can give an agent one client without handing it the rest, and keys can be revoked at any time.',
  },
];

export function IntegrationsIndexPage({ title, body }: { title: string; body: string }) {
  return (
    <>
      <PageHero
        accent="purple"
        badge={
          <>
            <IntegrationMark brand className="h-[44px] w-[44px]" />
            <span className="font-jakarta text-[15px] font-semibold text-white text-opacity-90 sm:text-[16px]">
              {brand.name} integrations
            </span>
          </>
        }
        title={title}
        lead={body}
        actions={
          <>
            <PrimaryPill href="#assistants">See the integrations</PrimaryPill>
            <OutlinePill href={registerUrl()} chevron>
              Start for $0
            </OutlinePill>
          </>
        }
        footnote={
          <p>
            Everything an assistant or a workflow creates arrives as a draft unless it is explicitly scheduled.
            Building your own?{' '}
            <Link href="/developers" className="underline underline-offset-2 transition-colors hover:text-white">
              See the developer docs
            </Link>
            .
          </p>
        }
        visual={
          <IntegrationMark
            brand
            ring={false}
            className="h-[150px] w-[150px] shadow-[0_30px_70px_rgba(10,0,40,0.5)] sm:h-[210px] sm:w-[210px] lg:h-[250px] lg:w-[250px]"
          />
        }
        tiles={integrations.slice(0, slots.length).map((item, i) => ({
          ...slots[i],
          key: item.slug,
          node: tileMark(item),
        }))}
      />

      <AccentScope>
        {groups.map((group, i) => (
          <Block key={group.title} id={i === 0 ? 'assistants' : 'automation'} title={group.title} intro={<p>{group.intro}</p>}>
            <GuideGrid items={integrations.filter((item) => group.kinds.includes(item.kind)).map(guide)} />
          </Block>
        ))}
      </AccentScope>

      <OrbitBand
        title="Every integration reaches every channel you run"
        description={`Connect your accounts in ${brand.name} once. Assistants, workflows and feeds can then post to any of the ${channelCount} networks, and ${brand.name} publishes at the time you set.`}
        center={<IntegrationMark brand ring={false} className="h-full w-full !rounded-none" />}
      />

      <AccentScope>
        <Block
          title="MCP server, public API or command line?"
          intro={
            <p>
              Every integration uses one of three ways in. All three use the same workspace API key and the same approval
              rules.
            </p>
          }
        >
          <DataTable
            label="MCP server, public API or command line"
            head={[...surfaceTable.head].map((h, i) => (i === 0 ? 'Way in' : h))}
            rows={surfaceTable.rows.map((row) => [...row])}
            minWidth={760}
          />
          <Note>
            Feeds need none of them: paste the feed URL and choose the channels. Details for each way in are on the{' '}
            <TextLink href="/developers">developers page</TextLink>.
          </Note>
        </Block>

        <Block
          title="Build your own"
          intro={<p>The same surfaces the integrations use are yours to call, on every plan.</p>}
        >
          <GuideGrid items={devSurfaces} />
        </Block>

        <Block title="Frequently asked questions">
          <FaqList items={faq} />
          <Note>
            Related: <TextLink href="/developers">developers</TextLink>, <TextLink href="/docs">docs</TextLink>,{' '}
            <TextLink href="/pricing">pricing</TextLink>.
          </Note>
        </Block>

        <ClosingBand
          title="Connect one today; the rest take minutes each"
          description="Assistants, automation tools and feeds all come with every plan."
          visual={
            <IntegrationMark
              brand
              ring={false}
              className="h-[180px] w-[180px] -rotate-6 shadow-[0_30px_70px_rgba(10,0,40,0.5)]"
            />
          }
          actions={
            <>
              <PrimaryPill href={registerUrl()}>Get an API key</PrimaryPill>
              <OutlinePill href="/developers">Developer docs</OutlinePill>
            </>
          }
        />
      </AccentScope>
    </>
  );
}
