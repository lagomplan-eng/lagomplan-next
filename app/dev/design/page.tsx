import DesignGuide from './DesignGuide'


/** ?embed=1 renders the guide without its header and without the mobile-preview iframe (used by the iframe itself). */
export default async function DesignPage({ searchParams }: { searchParams: Promise<{ embed?: string }> }) {
  const { embed } = await searchParams
  return <DesignGuide embed={embed === '1'} />
}
