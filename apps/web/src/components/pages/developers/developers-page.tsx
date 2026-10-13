import Link from 'next/link';
import { brand, registerUrl } from '@scheduler/brand';
import { DEV, DEV_PAGE, GUARDRAILS, SAMPLES, SAMPLE_NOTICE, SURFACES, cliName, envPrefix } from '@/content/developers';
import { getIntegration, integrations, kindLabel, surfaceOf, type Integration } from '@/content/integrations';
import {
  AccentScope,
  AlsoTry,
  Block,
  CardGrid,
  ChannelGrid,
  ChatExchange,
  CheckList,
  ClosingBand,
  CodeSteps,
  Columns,
  ConnectSection,
  DataTable,
  FaqList,
  FeatureBox,
  GuideGrid,
  LiveDot,
  Note,
  NumberedList,
  OrbitBand,
  SmallNote,
  StepCard,
  SubBlock,
  TextLink,
} from '@/components/pages/integrations/blocks';
import { CodeWindow } from '@/components/pages/integrations/code-window';
import { PageHero } from '@/components/pages/integrations/hero';
import { IntegrationMark } from '@/components/pages/integrations/mark';
import { OutlinePill, PrimaryPill } from '@/components/pages/integrations/pills';

/**
 * /developers, laid out like the reference's MCP server page: purple hero with
 * the MCP tile, "what can you build" cards, a surface table, the MCP connect
 * steps with per-tool cards and a setup table, the channel orbit, then every
 * surface (API, webhooks, MCP, CLI) as numbered panels with their samples,
 * the guardrails, example requests, channels, FAQ and the integration guides.
 *
 * Every sample is labelled illustrative, in its comment and in the notes
 * around it (see the note at the top of src/content/developers.ts).
 */

const sample = (id: string) => SAMPLES.find((s) => s.id === id);

/** Webhook events, in words; the event names themselves live in the API reference. */
const webhookEvents = [
  '# Illustrative. Event names are in the API reference.',
  'published',
  'failed',
  'approval requested',
  'approved',
  'rejected',
  'channel disconnected',
  'token expiring',
].join('\n');

const surfaceCode: Record<string, { title: string; code: string } | undefined> = {
  api: sample('curl') && { title: sample('curl')!.label, code: sample('curl')!.code },
  webhooks: { title: 'Events you can receive', code: webhookEvents },
  mcp: sample('mcp') && { title: sample('mcp')!.label, code: sample('mcp')!.code },
  cli: sample('cli') && { title: sample('cli')!.label, code: sample('cli')!.code },
};

const guardrailIcons = ['shield', 'key', 'eye', 'alert'];

const mark = (item: Integration, className: string) => (
  <IntegrationMark logo={item.logo} glyph={item.glyph} className={className} ring={false} />
);

const connection: Record<ReturnType<typeof surfaceOf>, string> = {
  mcp: 'MCP server',
  cli: 'Command line',
  api: 'Public API and webhooks',
  feed: 'Read directly',
};

const auth: Record<ReturnType<typeof surfaceOf>, string> = {
  mcp: 'Workspace API key',
  cli: 'Workspace API key, kept in user config',
  api: 'Workspace API key as a bearer token',
  feed: 'Not needed: paste the feed URL',
};

export function DevelopersPage() {
  const mcpSample = sample('mcp');
  const cliSample = sample('cli');
  const clientCards = ['chatgpt', 'claude', 'claude-code']
    .map((slug) => getIntegration(slug))
    .filter((x): x is Integration => Boolean(x));

  return (
    <>
      <PageHero
        accent="purple"
        badge={
          <>
            <IntegrationMark logo="mcp" className="h-11 w-11" />
            <span className="font-jakarta text-[15px] font-semibold text-white text-opacity-90 sm:text-[16px]">
              {DEV_PAGE.badge}
            </span>
          </>
        }
        title={DEV.title}
        lead={DEV.body}
        actions={
          <>
            <PrimaryPill href="/docs">Read the docs</PrimaryPill>
            <OutlinePill href={registerUrl()} chevron>
              Get an API key
            </OutlinePill>
          </>
        }
        footnote={
          <>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="underline underline-offset-2 transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/integrations" className="underline underline-offset-2 transition-colors hover:text-white">
                    Integrations
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white">Developers</li>
              </ol>
            </nav>
            <p className="mt-2">{DEV_PAGE.heroNote}</p>
          </>
        }
        visual={
          <IntegrationMark
            logo="mcp"
            ring={false}
            className="h-[150px] w-[150px] shadow-[0_30px_70px_rgba(10,0,40,0.5)] sm:h-[210px] sm:w-[210px] lg:h-[250px] lg:w-[250px]"
          />
        }
      />

      <AccentScope>
        <Block title={DEV_PAGE.buildTitle} intro={<p>{DEV_PAGE.buildIntro}</p>}>
          <CardGrid items={DEV_PAGE.build.map((b) => ({ ...b }))} />
        </Block>

        <Block title={DEV_PAGE.tableTitle} intro={<p>{DEV_PAGE.tableIntro}</p>}>
          <DataTable
            label={DEV_PAGE.tableTitle}
            head={[...DEV_PAGE.table.head].map((h, i) => (i === 0 ? 'Surface' : h))}
            rows={DEV_PAGE.table.rows.map((row) => [...row])}
            highlightColumn={DEV_PAGE.table.highlight}
            minWidth={760}
          />
          <Note>{GUARDRAILS.body}</Note>
        </Block>
      </AccentScope>

      <ConnectSection
        divider
        title={DEV_PAGE.connectTitle}
        intro={<p>{DEV_PAGE.connectIntro}</p>}
        steps={[...DEV_PAGE.connectSteps]}
        after={
          <>
            <SubBlock>
              <CardGrid
                items={clientCards.map((item) => ({
                  title: item.name,
                  description: `${kindLabel[item.kind]} · ${connection[surfaceOf(item)]}`,
                  children: (
                    <>
                      <Link
                        href={`/integrations/${item.slug}`}
                        className="mt-2 flex w-full items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-3 text-[16px] font-medium leading-[20.83px] text-[#0e0e0e] transition-all hover:bg-pink hover:text-white"
                      >
                        {item.name} setup
                      </Link>
                      <p>{item.summary}</p>
                      <p className="font-jakarta font-semibold text-white">Set it up in three steps:</p>
                      <NumberedList items={item.steps.map((s) => s.title)} />
                      {item.slug === 'claude' && mcpSample ? (
                        <CodeWindow title="MCP client configuration (illustrative)" code={mcpSample.code} />
                      ) : null}
                      {item.slug === 'claude-code' ? (
                        <CodeWindow
                          title="Terminal (illustrative)"
                          code={`export ${envPrefix}_API_KEY="<workspace API key>"\n${cliName} post --help`}
                        />
                      ) : null}
                    </>
                  ),
                }))}
              />
            </SubBlock>
            <SubBlock title={DEV_PAGE.setupTitle} intro={<p>{DEV_PAGE.setupIntro}</p>}>
              <DataTable
                label={DEV_PAGE.setupTitle}
                head={['Tool', 'How it connects', 'Where you set it up', 'Authentication']}
                rows={integrations.map((item) => [
                  <TextLink key="name" href={`/integrations/${item.slug}`}>
                    {item.name}
                  </TextLink>,
                  connection[surfaceOf(item)],
                  item.setupWhere,
                  auth[surfaceOf(item)],
                ])}
                minWidth={860}
              />
            </SubBlock>
            <SubBlock>
              <FeatureBox
                title={DEV_PAGE.noMcpTitle}
                aside={cliSample ? <CodeWindow title={cliSample.label} code={cliSample.code} /> : undefined}
              >
                <p>
                  {SURFACES.find((s) => s.id === 'cli')?.body} See the <TextLink href="#cli">command line</TextLink>{' '}
                  below.
                </p>
                <p>
                  Automation tools call the <TextLink href="#api">public API</TextLink> instead:{' '}
                  <TextLink href="/integrations/n8n">n8n</TextLink>, <TextLink href="/integrations/make">Make</TextLink>{' '}
                  and <TextLink href="/integrations/zapier">Zapier</TextLink> each have a setup page.
                </p>
              </FeatureBox>
            </SubBlock>
          </>
        }
      >
        <StepCard
          step={1}
          label="Connect"
          meta="Settings → API"
          title={DEV_PAGE.connectCard.title}
          description={DEV_PAGE.connectCard.body}
        >
          {mcpSample ? <CodeWindow title={mcpSample.label} code={mcpSample.code} copy /> : null}
          <SmallNote>{DEV_PAGE.connectCard.note}</SmallNote>
        </StepCard>
        <StepCard
          step={2}
          label="Ask"
          meta={
            <>
              <LiveDot />
              lands as a draft
            </>
          }
          title={DEV_PAGE.askCard.title}
          description={DEV_PAGE.askCard.body}
        >
          <ChatExchange
            user={DEV_PAGE.askCard.user}
            reply={DEV_PAGE.askCard.reply}
            avatar={<IntegrationMark logo="mcp" className="h-7 w-7" ring={false} />}
            via={[...DEV_PAGE.askCard.via]}
            viaLabel={`via ${brand.name}`}
          />
          <AlsoTry items={[...DEV_PAGE.askCard.alsoTry]} />
        </StepCard>
      </ConnectSection>

      <OrbitBand
        title={DEV_PAGE.orbitTitle}
        description={DEV_PAGE.orbitBody}
        center={<IntegrationMark logo="mcp" ring={false} className="h-full w-full !rounded-none" />}
      />

      <AccentScope>
        <Block id="surfaces" title={DEV_PAGE.surfacesTitle} intro={<p>{SAMPLE_NOTICE}</p>}>
          <CodeSteps
            steps={SURFACES.map((surface) => ({
              id: surface.id,
              title: `${surface.eyebrow}: ${surface.title}`,
              description: (
                <>
                  <p>{surface.body}</p>
                  <CheckList items={surface.points} />
                </>
              ),
              code: surfaceCode[surface.id]?.code,
              codeTitle: surfaceCode[surface.id]?.title,
            }))}
          />
        </Block>

        <Block title={GUARDRAILS.title} intro={<p>{GUARDRAILS.body}</p>}>
          <CardGrid
            items={GUARDRAILS.items.map((item, i) => ({
              icon: guardrailIcons[i],
              title: item.title,
              description: item.body,
            }))}
          />
        </Block>

        <Block title={DEV_PAGE.askTitle} intro={<p>{DEV_PAGE.askIntro}</p>}>
          <Columns cols={3}>
            {DEV_PAGE.chats.map((chat) => (
              <ChatExchange
                key={chat.user}
                user={chat.user}
                reply={chat.reply}
                avatar={<IntegrationMark logo="mcp" className="h-7 w-7" ring={false} />}
                via={[...chat.via]}
                viaLabel={`via ${brand.name}`}
              />
            ))}
          </Columns>
          <Note>
            Need it to run without anyone asking? The <TextLink href="#cli">command line</TextLink> runs unattended in
            CI, and the <TextLink href="#api">public API</TextLink> takes requests from any scheduler or automation
            tool.
          </Note>
        </Block>

        <Block title={DEV_PAGE.channelsTitle} intro={<p>{DEV_PAGE.channelsIntro}</p>}>
          <ChannelGrid />
          <Note>
            Each network has its own page with what a post can carry there. See{' '}
            <TextLink href="/channels">every channel</TextLink>.
          </Note>
        </Block>

        <Block title={DEV_PAGE.faqTitle}>
          <FaqList items={DEV_PAGE.faq.map((f) => ({ ...f }))} />
          <Note>
            Pricing questions? <TextLink href="/pricing">Compare plans</TextLink>. Setup guides are in the{' '}
            <TextLink href="/docs">docs</TextLink>.
          </Note>
        </Block>

        <Block title={DEV_PAGE.guidesTitle} intro={<p>{DEV_PAGE.guidesIntro}</p>}>
          <GuideGrid
            items={integrations.map((item) => ({
              name: item.name,
              href: `/integrations/${item.slug}`,
              blurb: item.blurb,
              mark: mark(item, 'h-8 w-8 sm:h-10 sm:w-10'),
            }))}
          />
          <Note>
            <TextLink href="/pricing">Pricing</TextLink>: the API, webhooks, MCP server and command line are on every
            plan.
          </Note>
        </Block>

        <ClosingBand
          title={DEV_PAGE.closingTitle}
          description={DEV_PAGE.closingBody}
          visual={
            <IntegrationMark
              logo="mcp"
              ring={false}
              className="h-[180px] w-[180px] -rotate-6 shadow-[0_30px_70px_rgba(10,0,40,0.5)]"
            />
          }
          actions={
            <>
              <PrimaryPill href={registerUrl()}>Get an API key</PrimaryPill>
              <OutlinePill href="/pricing">See pricing</OutlinePill>
            </>
          }
        />
      </AccentScope>
    </>
  );
}
