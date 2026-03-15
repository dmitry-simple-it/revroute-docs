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

// Passthrough stub for any unknown Mintlify snippet component
const Stub = ({ children }: { children?: React.ReactNode }) => <>{children || null}</>

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
    // Snippet components from Mintlify — render as passthrough stubs
    FetchPartnerDiscountData: Stub,
    ConversionTrackingPrerequisites: Stub,
    ViewConversions: Stub,
    LeadsOutro: Stub,
    LeadsIntro: Stub,
    LeadAttributes: Stub,
    SaleAttributes: Stub,
    SalesAttributes: Stub,
    SalesIntro: Stub,
    EnableConversionTracking: Stub,
    DubAnalytics: Stub,
    DubClientInstall: Stub,
    DubClientInstallVerify: Stub,
    DubConversionTrackingDemoApps: Stub,
    DubReactNativeInstall: Stub,
    DubSwiftInstall: Stub,
    ClientSideLeadTracking: Stub,
    ClientSideSaleTracking: Stub,
    ClientSideTrackingInstall: Stub,
    AuthProviders: Stub,
    InitializeIosSdkStep: Stub,
    InitializeReactNativeSdkStep: Stub,
    InstallIosSdkStep: Stub,
    InstallReactNativeSdkStep: Stub,
    ReferralsEmbedGuide: Stub,
    Image: (props: any) => <img {...props} style={{ maxWidth: '100%', borderRadius: '0.5rem', ...props.style }} />,
    ...components,
  }
}
