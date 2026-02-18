import {
  MapPin,
  PriceTag,
  FileCheck,
  FileVerify,
  ChatBubble,
  Search,
} from "../icons";

export const FIRST_CARDS_CONFIG = [
  {
    titleKey: "initialPage.buyLands",
    descKey: "initialPage.searchLandsDescription",
    Icon: MapPin,
    to: "/search",
    ButtonIcon: Search,
    buttonTextKey: "initialPage.startSearch",
    primary: true,
    background: null,
  },
  {
    titleKey: "initialPage.sellLands",
    descKey: "initialPage.sellLandsDescription",
    Icon: PriceTag,
    to: "/add-listing",
    ButtonIcon: null,
    buttonTextKey: "initialPage.getStarted",
    primary: false,
    background: null,
  },
  {
    titleKey: "initialPage.howItWorks",
    descKey: "initialPage.howItWorksDescription",
    Icon: FileCheck,
    to: "/how-it-works",
    ButtonIcon: null,
    buttonTextKey: "initialPage.learnMore",
    primary: false,
    background: null,
  },
];

export const SECOND_CARDS_CONFIG = [
  {
    titleKey: "initialPage.searchLand",
    descKey: "initialPage.searchLandDescription",
    Icon: MapPin,
    to: null,
    ButtonIcon: null,
    buttonTextKey: null,
    primary: false,
    background: "url(/images/cards/search-lands-bg.png)",
  },
  {
    titleKey: "initialPage.checkDetails",
    descKey: "initialPage.checkDetailsDescription",
    Icon: FileVerify,
    to: null,
    ButtonIcon: null,
    buttonTextKey: null,
    primary: false,
    background: "url(/images/cards/check-details-bg.png)",
  },
  {
    titleKey: "initialPage.contactOwner",
    descKey: "initialPage.contactOwnerDescription",
    Icon: ChatBubble,
    to: null,
    ButtonIcon: null,
    buttonTextKey: null,
    primary: false,
    background: "url(/images/cards/contact-owner-bg.png)",
  },
];
