import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  Info, Tip, Warning, Note,
  Frame,
  Card, CardGroup,
  Steps, Step,
  Accordion, AccordionGroup,
  Tabs, Tab, CodeGroup,
  ParamField, ResponseField, Expandable,
  CheckList, CheckListItem,
  ImageCtaCard, ImageLink,
  PayoutSupportedCountries, DefaultDomainsSlider, NpmPackage, VideoPlayer, ImageCarousel,
} from './components/mintlify'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components: Record<string, unknown>) {
  return {
    ...docsComponents,
    Info, Tip, Warning, Note,
    Frame,
    Card, CardGroup,
    Steps, Step,
    Accordion, AccordionGroup,
    Tabs, Tab, CodeGroup,
    ParamField, ResponseField, Expandable,
    CheckList, CheckListItem,
    ImageCtaCard, ImageLink,
    PayoutSupportedCountries, DefaultDomainsSlider, NpmPackage, VideoPlayer, ImageCarousel,
    Image: (props: any) => <img {...props} style={{ maxWidth: '100%', borderRadius: '0.5rem', ...props.style }} />,
    ...components,
  }
}
