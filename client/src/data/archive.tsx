export interface Pokedex {
  archive: Archive;
}

export interface Archive {
  manifest: Manifest;
  accountCreationIp: AccountCreationIP;
  accountTimezone: AccountTimezone;
  account: ArchiveAccount;
  ads: AdElement[];
  ads1: Ads1[];
  ageMeta: AgeMeta;
  blocking: Blocking[];
  deviceToken: DeviceToken;
  follower: Blocking[];
  following: Blocking[];
  ipAudits: IPAuditElement[];
  like: Like[];
  userListInfo: UserListInfo;
  moment: Moment;
  muting: Blocking[];
  niDeviceResponse: NIDeviceResponse;
  p13nData: P13NData;
  device: Device;
  profile: Profile;
  media: ArchiveMedia[];
  screenNameChange: ArchiveScreenNameChange;
  tweet: ArchiveTweet[];
  verified: Verified;
}

export interface ArchiveAccount {
  email: string;
  createdVia: string;
  username: string;
  accountId: string;
  createdAt: Date;
  accountDisplayName: string;
}

export interface AccountCreationIP {
  accountId: string;
  userCreationIp: NIP;
}

export enum NIP {
  The107117200113 = "107.117.200.113",
  The4714620916 = "47.146.209.16",
  The64124373 = "64.124.37.3",
  The65215127162 = "65.215.127.162",
  The97116216 = "97.116.2.16",
}

export interface AccountTimezone {
  accountId: string;
}

export interface AdElement {
  ad: AdAd;
}

export interface AdAd {
  adsUserData: PurpleAdsUserData;
}

export interface PurpleAdsUserData {
  adEngagements: AdEngagements;
}

export interface AdEngagements {
  engagements: Engagement[];
}

export interface Engagement {
  impressionAttributes: Impression;
  engagementAttributes: EngagementAttribute[];
}

export interface EngagementAttribute {
  engagementTime: Date;
  engagementType: string;
}

export interface Impression {
  deviceInfo: DeviceInfo;
  displayLocation: DisplayLocation;
  promotedTrendInfo?: PromotedTrendInfo;
  advertiserInfo: AdvertiserInfo;
  impressionTime: Date;
  matchedTargetingCriteria?: MatchedTargetingCriterion[];
}

export interface AdvertiserInfo {
  advertiserName: string;
  screenName: string;
}

export interface DeviceInfo {
  osType: OSType;
}

export enum OSType {
  Desktop = "Desktop",
}

export enum DisplayLocation {
  Trends = "Trends",
  WtfSidebar = "WtfSidebar",
}

export interface MatchedTargetingCriterion {
  targetingType: TargetingType;
  targetingValue: string;
}

export enum TargetingType {
  Age = "Age",
  FollowerLookAlikes = "Follower look-alikes",
  Interests = "Interests",
  Keywords = "Keywords",
  Languages = "Languages",
  List = "List",
  Locations = "Locations",
}

export interface PromotedTrendInfo {
  trendId: string;
  name: string;
  description: string;
}

export interface Ads1 {
  ad: Ads1Ad;
}

export interface Ads1Ad {
  adsUserData: FluffyAdsUserData;
}

export interface FluffyAdsUserData {
  adImpressions: AdImpressions;
}

export interface AdImpressions {
  impressions: Impression[];
}

export interface AgeMeta {
  ageInfo: AgeInfo;
}

export interface AgeInfo {
  age: string[];
  birthDate: string;
}

export interface Blocking {
  accountId: string;
  userLink: string;
}

export interface Device {
  phoneNumber: string;
}

export interface DeviceToken {
  clientApplicationId: string;
  token: string;
  createdAt: Date;
  lastSeenAt: Date;
  clientApplicationName: string;
}

export interface IPAuditElement {
  ipAudit: IPAuditIPAudit;
}

export interface IPAuditIPAudit {
  accountId: string;
  createdAt: Date;
  loginIp: NIP;
}

export interface Like {
  tweetId: string;
  fullText: string;
  expandedUrl: string;
}

export interface Manifest {
  userInfo: UserInfo;
  archiveInfo: ArchiveInfo;
  readmeInfo: ReadmeInfo;
  dataTypes: DataTypes;
}

export interface ArchiveInfo {
  sizeBytes: string;
  generationDate: Date;
  isPartialArchive: boolean;
  maxPartSizeBytes: string;
}

export interface DataTypes {
  account: AccountCreationIPClass;
  accountCreationIp: AccountCreationIPClass;
  accountSuspension: AccountCreationIPClass;
  accountTimezone: AccountCreationIPClass;
  adEngagements: AccountCreationIPClass;
  adImpressions: AccountCreationIPClass;
  adMobileConversionsAttributed: AccountCreationIPClass;
  adMobileConversionsUnattributed: AccountCreationIPClass;
  adOnlineConversionsAttributed: AccountCreationIPClass;
  adOnlineConversionsUnattributed: AccountCreationIPClass;
  ageinfo: AccountCreationIPClass;
  app: AccountCreationIPClass;
  birdwatchNote: AccountCreationIPClass;
  birdwatchNoteRating: AccountCreationIPClass;
  block: AccountCreationIPClass;
  branchLinks: AccountCreationIPClass;
  communityTweet: CommunityTweet;
  communityTweetMedia: Media;
  connectedApplication: AccountCreationIPClass;
  contact: AccountCreationIPClass;
  deviceToken: AccountCreationIPClass;
  directMessageGroupHeaders: AccountCreationIPClass;
  directMessageHeaders: AccountCreationIPClass;
  directMessageMute: AccountCreationIPClass;
  directMessages: CommunityTweet;
  directMessagesGroup: CommunityTweet;
  directMessagesGroupMedia: Media;
  directMessagesMedia: Media;
  emailAddressChange: AccountCreationIPClass;
  follower: AccountCreationIPClass;
  following: AccountCreationIPClass;
  ipAudit: AccountCreationIPClass;
  like: AccountCreationIPClass;
  listsCreated: AccountCreationIPClass;
  listsMember: AccountCreationIPClass;
  listsSubscribed: AccountCreationIPClass;
  moment: CommunityTweet;
  momentsMedia: Media;
  momentsTweetsMedia: Media;
  mute: AccountCreationIPClass;
  niDevices: AccountCreationIPClass;
  periscopeAccountInformation: AccountCreationIPClass;
  periscopeBanInformation: AccountCreationIPClass;
  periscopeBroadcastMetadata: AccountCreationIPClass;
  periscopeCommentsMadeByUser: AccountCreationIPClass;
  periscopeExpiredBroadcasts: AccountCreationIPClass;
  periscopeFollowers: AccountCreationIPClass;
  periscopeProfileDescription: AccountCreationIPClass;
  personalization: AccountCreationIPClass;
  phoneNumber: AccountCreationIPClass;
  professionalData: AccountCreationIPClass;
  profile: CommunityTweet;
  profileMedia: Media;
  protectedHistory: AccountCreationIPClass;
  replyPrompt: AccountCreationIPClass;
  savedSearch: AccountCreationIPClass;
  screenNameChange: AccountCreationIPClass;
  smartblock: AccountCreationIPClass;
  spacesMetadata: AccountCreationIPClass;
  sso: AccountCreationIPClass;
  tweet: CommunityTweet;
  tweetMedia: Media;
  userLinkClicks: AccountCreationIPClass;
  verified: AccountCreationIPClass;
}

export interface AccountCreationIPClass {
  files: File[];
}

export interface File {
  fileName: string;
  globalName: string;
  count: string;
}

export interface CommunityTweet {
  mediaDirectory: string;
  files: File[];
}

export interface Media {
  mediaDirectory: string;
}

export interface ReadmeInfo {
  fileName: string;
  directory: string;
  name: string;
}

export interface UserInfo {
  accountId: string;
  userName: string;
  displayName: string;
}

export interface ArchiveMedia {
  name: string;
  type: string;
  data: string;
  id: string;
  category: string;
}

export interface Moment {
  momentId: string;
  createdAt: Date;
  createdBy: string;
  title: string;
  coverMediaUrls: any[];
  tweets: MomentTweet[];
}

export interface MomentTweet {
  momentId: string;
  tweet: TweetTweet;
}

export interface TweetTweet {
  deviceSource: DeviceSource;
  urls: TweetURL[];
  coreData: CoreData;
  mentions: any[];
  id: string;
  language: TweetLanguage;
  media: any[];
  counts: Counts;
  cashtags: any[];
  hashtags: Hashtag[];
}

export interface CoreData {
  nsfwUser: boolean;
  createdVia: string;
  nsfwAdmin: boolean;
  createdAtSecs: string;
  text: string;
  nullcast: boolean;
  conversationId: string;
  userId: string;
  hasTakedown: boolean;
  hasMedia: boolean;
}

export interface Counts {
  retweetCount: string;
  replyCount: string;
  favoriteCount: string;
}

export interface DeviceSource {
  name: string;
  parameter: string;
  url: string;
  internalName: string;
  id: string;
  clientAppId: string;
  display: string;
}

export interface Hashtag {
  fromIndex: string;
  toIndex: string;
  text: string;
}

export interface TweetLanguage {
  language: string;
  rightToLeft: boolean;
  confidence: string;
}

export interface TweetURL {
  url: string;
  expanded: string;
  toIndex: string;
  fromIndex: string;
  display: string;
}

export interface NIDeviceResponse {
  messagingDevice: MessagingDevice;
}

export interface MessagingDevice {
  deviceType: string;
  carrier: string;
  phoneNumber: string;
  createdDate: string;
}

export interface P13NData {
  demographics: Demographics;
  interests: Interests;
  locationHistory: string[];
  inferredAgeInfo: AgeInfo;
}

export interface Demographics {
  languages: LanguageElement[];
  genderInfo: GenderInfo;
}

export interface GenderInfo {
  gender: string;
}

export interface LanguageElement {
  language: string;
  isDisabled: boolean;
}

export interface Interests {
  interests: Interest[];
  partnerInterests: any[];
  audienceAndAdvertisers: AudienceAndAdvertisers;
  shows: any[];
}

export interface AudienceAndAdvertisers {
  numAudiences: string;
  advertisers: string[];
  lookalikeAdvertisers: string[];
}

export interface Interest {
  name: string;
  isDisabled: boolean;
}

export interface Profile {
  description: Description;
  avatarMediaUrl: string;
}

export interface Description {
  bio: string;
  website: string;
  location: string;
}

export interface ArchiveScreenNameChange {
  accountId: string;
  screenNameChange: ScreenNameChangeScreenNameChange;
}

export interface ScreenNameChangeScreenNameChange {
  changedAt: Date;
  changedFrom: string;
  changedTo: string;
}

export interface ArchiveTweet {
  retweeted: boolean;
  source: string;
  entities: Entities;
  display_text_range: string[];
  favorite_count: string;
  id_str: string;
  truncated: boolean;
  retweet_count: string;
  id: string;
  created_at: string;
  favorited: boolean;
  full_text: string;
  lang: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id?: string;
  in_reply_to_status_id?: string;
  in_reply_to_screen_name?: string;
  in_reply_to_user_id_str?: string;
  possibly_sensitive?: boolean;
  extended_entities?: ExtendedEntities;
}

export interface Entities {
  hashtags: any[];
  symbols: any[];
  user_mentions: UserMention[];
  urls: EntitiesURL[];
  media?: EntitiesMedia[];
}

export interface EntitiesMedia {
  expanded_url: string;
  indices: string[];
  url: string;
  media_url: string;
  id_str: string;
  id: string;
  media_url_https: string;
  sizes: Sizes;
  type: string;
  display_url: string;
  video_info?: VideoInfo;
}

export interface Sizes {
  thumb: Large;
  large: Large;
  medium: Large;
  small: Large;
}

export interface Large {
  w: string;
  h: string;
  resize: string;
}

export interface VideoInfo {
  aspect_ratio: string[];
  variants: Variant[];
}

export interface Variant {
  bitrate: string;
  content_type: string;
  url: string;
}

export interface EntitiesURL {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: string[];
}

export interface UserMention {
  name: string;
  screen_name: string;
  indices: string[];
  id_str: string;
  id: string;
}

export interface ExtendedEntities {
  media: EntitiesMedia[];
}

export interface UserListInfo {
  url: string;
}

export interface Verified {
  accountId: string;
  verified: boolean;
}
