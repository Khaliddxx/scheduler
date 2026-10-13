import { brand, registerUrl } from '@scheduler/brand';
import { SAMPLES } from '@/content/developers';
import { copyFor, getIntegration, integrations, surfaceTable, type Integration } from '@/content/integrations';
import { previewImage } from '@/lib/preview-media';
import {
  AccentScope,
  AlsoTry,
  Block,
  CardGrid,
  ChannelGrid,
  ChatExchange,
  CheckList,
  ClosingBand,
  CodeCard,
  Columns,
  ConnectSection,
  DataTable,
  FaqList,
  FeatureBox,
  GuideGrid,
  LiveDot,
  Note,
  OrbitBand,
  PromptCards,
  SmallNote,
  StepCard,
  SubBlock,
  TextLink,
} from './blocks';
import { CodeWindow } from './code-window';
import { PageHero, type HeroMedia } from './hero';
import { IntegrationMark } from './mark';
import { OutlinePill, PrimaryPill } from './pills';
import { Rich } from './rich';

/**
 * The page behind /integrations/<slug>: the reference's agent-page template,
 * filled from src/content/integrations.ts.
 *
 * Order: gradient hero → "connect in three steps" (two step cards and a
 * numbered recap) → channel orbit band → MCP/API/CLI table → feature cards →
 * "what is…" panel with a code window → prompt cards → channel grid → "which
 * one fits" cards → cost/security/troubleshooting → FAQ → closing band. Feeds
 * skip the table, which compares the ways in that a feed does not use.
 */

/** Mascot stills: intrinsic size and width at each breakpoint (fixed per character). */
const mascots: Record<string, { width: number; height: number; className: string }> = {
  claude: { width: 694, height: 834, className: 'w-[224px] sm:w-[317px] lg:w-[392px]' },
  chatgpt: { width: 660, height: 846, className: 'w-[211px] sm:w-[298px] lg:w-[369px]' },
  'claude-code': { width: 686, height: 688, className: 'w-[269px] sm:w-[381px] lg:w-[471px]' },
  codex: { width: 686, height: 780, className: 'w-[236px] sm:w-[334px] lg:w-[414px]' },
  cursor: { width: 652, height: 840, className: 'w-[209px] sm:w-[295px] lg:w-[365px]' },
  gemini: { width: 686, height: 806, className: 'w-[230px] sm:w-[325px] lg:w-[402px]' },
};

function heroMedia(item: Integration): HeroMedia | null {
  if (!item.hero) return null;
  const poster = previewImage(`integrations/${item.hero}-hero.webp`);
  const size = mascots[item.hero];
  if (!poster || !size) return null;
  return {
    poster,
    clip: previewImage(`integrations/${item.hero}-hero.webm`),
    mobileClip: previewImage(`integrations/${item.hero}-hero-mobile.webm`),
    ...size,
  };
}

export function Mark({ item, className, ring }: { item: Integration; className: string; ring?: boolean }) {
  return <IntegrationMark logo={item.logo} glyph={item.glyph} className={className} ring={ring} />;
}

export function IntegrationPage({ item }: { item: Integration }) {
  const copy = copyFor(item);
  const accent = item.accent;
  const media = heroMedia(item);
  const related = item.related.map((slug) => getIntegration(slug)).filter((x): x is Integration => Boolean(x));
  const sample = copy.explainCode?.sample ? SAMPLES.find((s) => s.id === copy.explainCode?.sample) : undefined;
  const explainCode = copy.explainCode
    ? { title: copy.explainCode.title, code: sample?.code ?? copy.explainCode.code ?? '' }
    : null;

  const actions = (
    <>
      <PrimaryPill href="#connect">{copy.ctaLabel}</PrimaryPill>
      <OutlinePill href={registerUrl()} chevron>
        Start for $0
      </OutlinePill>
    </>
  );

  const bigMark = (
    <Mark
      item={item}
      ring={false}
      className="h-[150px] w-[150px] shadow-[0_30px_70px_rgba(10,0,40,0.5)] sm:h-[210px] sm:w-[210px] lg:h-[250px] lg:w-[250px]"
    />
  );

  return (
    <>
      <PageHero
        accent={accent}
        badge={
          <>
            <Mark item={item} className="h-[44px] w-[44px]" />
            <span className="font-jakarta text-[15px] font-semibold text-white text-opacity-90 sm:text-[16px]">
              {item.name} + {brand.name}
            </span>
          </>
        }
        title={item.headline}
        bullets={item.bullets}
        actions={actions}
        footnote={
          <p>
            <Rich text={copy.footnote} plain />
          </p>
        }
        media={media}
        visual={media ? undefined : bigMark}
      />

      <ConnectSection
        accent={accent}
        title={copy.connectTitle}
        intro={
          <p>
            {item.summary} {copy.connectRecap}
          </p>
        }
        steps={item.steps.map((step) => `${step.title}: ${step.body}`)}
        after={
          <Note>
            <Rich text={copy.afterNote} />
          </Note>
        }
      >
        <StepCard
          step={1}
          label={copy.connectCard.label}
          meta={copy.connectCard.meta}
          title={copy.connectCard.title}
          description={copy.connectCard.body}
        >
          <CodeWindow title={copy.connectCard.codeTitle} code={copy.connectCard.code} copy />
          {copy.connectCard.notes.map((note) => (
            <SmallNote key={note}>
              <Rich text={note} />
            </SmallNote>
          ))}
        </StepCard>
        <StepCard
          step={2}
          label={copy.askCard.label}
          meta={
            <>
              <LiveDot />
              {copy.askCard.meta}
            </>
          }
          title={copy.askCard.title}
          description={copy.askCard.body}
        >
          {copy.askCard.chat ? (
            <>
              <ChatExchange
                user={copy.askCard.chat.user}
                reply={copy.askCard.chat.reply}
                avatar={
                  item.kind === 'feed' ? (
                    <IntegrationMark brand className="h-[28px] w-[28px]" ring={false} />
                  ) : (
                    <Mark item={item} className="h-[28px] w-[28px]" ring={false} />
                  )
                }
                via={copy.askCard.chat.via}
                viaLabel={`via ${brand.name}`}
              />
              <AlsoTry items={copy.askCard.chat.alsoTry} />
            </>
          ) : copy.askCard.code ? (
            <CodeWindow title={copy.askCard.codeTitle ?? 'Example'} code={copy.askCard.code} />
          ) : null}
        </StepCard>
      </ConnectSection>

      <OrbitBand
        accent={accent}
        title={copy.orbitTitle}
        description={copy.orbitBody}
        center={<Mark item={item} ring={false} className="h-full w-full !rounded-none" />}
      />

      <AccentScope accent={accent}>
        {copy.table ? (
          <Block title={copy.table.title} intro={<p>{copy.table.intro}</p>}>
            <DataTable
              label={copy.table.title}
              head={[...surfaceTable.head].map((h, i) => (i === 0 ? 'Way in' : h))}
              rows={surfaceTable.rows.map((row) => [...row])}
              highlightColumn={copy.table.highlight}
              minWidth={760}
            />
            <Note>{copy.table.note}</Note>
          </Block>
        ) : null}

        <Block title={copy.featuresTitle} intro={<p>{copy.featuresIntro}</p>}>
          <CardGrid items={copy.features} />
        </Block>

        <Block title={copy.explainTitle} intro={<p>{copy.explainIntro}</p>}>
          {copy.terminalCards ? (
            <Columns>
              {copy.terminalCards.map((card) => (
                <CodeCard key={card.title} title={card.title} meta={card.meta} code={card.code} codeTitle={card.codeTitle}>
                  <p>{card.body}</p>
                </CodeCard>
              ))}
            </Columns>
          ) : null}
          <SubBlock>
            <FeatureBox
              title={copy.explainBoxTitle}
              list={copy.explainList}
              aside={explainCode ? <CodeWindow title={explainCode.title} code={explainCode.code} /> : undefined}
            >
              <p>{copy.explainBoxBody}</p>
            </FeatureBox>
          </SubBlock>
          <Note>
            <Rich text={copy.explainNote} />
          </Note>
        </Block>

        <Block title={copy.promptsTitle} intro={<p>{copy.promptsIntro}</p>}>
          <PromptCards cards={copy.prompts} />
        </Block>

        <Block title={copy.channelsTitle} intro={<p>{copy.channelsIntro}</p>}>
          <ChannelGrid />
          <Note>
            Each network has its own page with what a post can carry there. See{' '}
            <TextLink href="/channels">every channel</TextLink>.
          </Note>
        </Block>

        <Block title={copy.compareTitle} intro={<p>{copy.compareIntro}</p>}>
          <CardGrid
            items={[
              { title: `${item.name} (this page)`, current: true, children: <p>{item.summary}</p> },
              ...related.map((r) => ({
                title: <TextLink href={`/integrations/${r.slug}`}>{r.name}</TextLink>,
                children: <p>{r.summary}</p>,
              })),
            ]}
          />
          <Note>
            Using something else? <TextLink href="/integrations">See every integration</TextLink>, or build your own on
            the <TextLink href="/developers">public API</TextLink>.
          </Note>
        </Block>

        <Block title={copy.costTitle}>
          <CardGrid
            items={[
              {
                title: 'What does it cost?',
                children: (
                  <>
                    <p>{copy.cost}</p>
                    <p>
                      <TextLink href="/pricing">Compare plans</TextLink>
                    </p>
                  </>
                ),
              },
              { title: 'How is access secured?', children: <p>{copy.security}</p> },
              { title: 'Something not working?', children: <CheckList items={copy.troubleshooting} /> },
            ]}
          />
        </Block>

        <Block title={copy.othersTitle} intro={<p>{copy.othersIntro}</p>}>
          <GuideGrid
            items={integrations
              .filter((other) => other.slug !== item.slug)
              .map((other) => ({
                name: other.name,
                href: `/integrations/${other.slug}`,
                blurb: other.blurb,
                mark: <Mark item={other} ring={false} className="h-8 w-8 sm:h-10 sm:w-10" />,
              }))}
          />
          <Note>
            Building your own? The <TextLink href="/developers">developers page</TextLink> covers the API, webhooks, MCP
            server and command line.
          </Note>
        </Block>

        <Block title={copy.faqTitle}>
          <FaqList items={copy.faq} />
          <Note>
            Related: <TextLink href="/integrations">all integrations</TextLink>,{' '}
            <TextLink href="/developers">developers</TextLink>, <TextLink href="/docs">docs</TextLink>,{' '}
            <TextLink href="/pricing">pricing</TextLink>.
          </Note>
        </Block>

        <ClosingBand
          accent={accent}
          title={copy.closingTitle}
          description={copy.closingBody}
          image={media ? { src: media.poster, width: media.width, height: media.height } : null}
          visual={
            media ? undefined : (
              <Mark
                item={item}
                ring={false}
                className="h-[180px] w-[180px] -rotate-6 shadow-[0_30px_70px_rgba(10,0,40,0.5)]"
              />
            )
          }
          actions={actions}
        />
      </AccentScope>
    </>
  );
}
