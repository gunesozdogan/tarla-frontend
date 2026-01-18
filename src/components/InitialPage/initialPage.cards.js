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
    titleKey: "initialPage.searchLands",
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
    titleKey: "initialPage.checkLands",
    descKey: "initialPage.checkLandsDescription",
    Icon: FileCheck,
    to: "/fieldsView",
    ButtonIcon: null,
    buttonTextKey: "initialPage.checkNow",
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
