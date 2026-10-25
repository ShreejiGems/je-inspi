export const userMessage = {
  USER_NOT_FOUND: 'User not exist',
  USER_ALREADY_EXIST: 'User already exist',
  USER_IS_DELETED: 'User is deleted',
  USER_DELETED_SUCCESS: 'User is deleted successfully',
  USER_PURCHASE_FAIL:
    'Since there were multiple failed attempts to provide 2FA code. Please try again after 10 minutes.',
  USER_EMAIL_EXIST: 'User already exist with this email',
  USER_MOBILE_EXIST: 'User already exist with this phone number',
  VALIDATION_FAILED: 'User validation failed',
  USER_TYPE_DIFFERENCE: 'user type not matched',
  USER_DETAILS_NOT_FOUND: 'user details not found',
  USER_DETAILS_IS_DELETED: 'user details is deleted',
  COMPLETE_PROFILE: 'Please complete your profile.',
  CANNOT_UPDATE_YOU: 'You can not change your status',
  NOT_ALLOWED: 'You are not allowed to do this operation',
  USER_LOGGED_OUT_SUCCESSFULLY: 'User logged out successfully',
  ALLOW_MAIN_ADMIN_ONLY: 'Only admin can perform this operation',
  CONTACT_SYNC: 'Contact sync successfully',
};

export const OtpMessage = {
  OTP_ALREADY_EXIST: 'Otp already exist',
  OTP_NOT_FOUND: 'Otp not found',
  OTP_IS_DELETED: 'Otp is deleted',
};

export const adminMessage = {
  USER_ALREADY_EXIST: 'Admin already exist',
  USER_NOT_FOUND: 'Admin not exist',
  USER_ADDED_SUCCESSFULLY: 'User added successfully',
  NOT_ADMIN:
    'You are not allowed to perform this operation as you are not an admin.',
};

export const organizationMessage = {
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  ORGANIZATION_ALREADY_EXIST: 'Organization already exist',
  ORGANIZATION_IS_DELETED: 'Organization is deleted',
  DIFF_USER_ORGANIZATION: 'User is registered with different organization',
};

export const userSessionMessage = {
  USER_SESSION_NOT_FOUND: 'User session not found',
  USER_SESSION_IS_DELETED: 'User session is deleted',
};

export const passwordMessages = {
  PASSWORD_NOT_FOUND: 'Password not found',
  PASSWORD_ALREADY_EXIST: 'Password already exist',
  PASSWORD_IS_DELETED: 'Password is deleted',
  PASSWORD_UPDATED: 'Password is successfully updated',
};

export const notificationMessage = {
  NOTIFICATION_NOT_FOUND: 'Notification not found',
  NOTIFICATION_ALREADY_EXIST: 'Notification already exist',
  NOTIFICATION_IS_DELETED: 'Notification is deleted',
};

export const emailOtpMessage = {
  EMAIL_OTP_NOT_FOUND: 'Email OTP not found',
  EMAIL_OTP_ALREADY_EXIST: 'Email OTP already exist',
  EMAIL_OTP_IS_DELETED: 'Email OTP is deleted',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  OTP_NOT_VERIFIED: 'OTP not verified',
};

export const locationMessage = {
  LOCATION_NOT_FOUND: 'Location not found',
  LOCATION_IS_DELETED: 'Location is deleted',
};

export const mediaMessage = {
  MEDIA_NOT_FOUND: 'Media not found',
  MEDIA_IS_DELETED: 'Media is deleted',
};

export const authMessages = {
  ACCOUNT_DEACTIVATED: 'User is disabled.',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_CREDENTIALS_ERROR: 'Invalid email or password.',
  AUTH_HEADER_NOT_FOUND: 'Authorization header not found.',
  AUTH_HEADER_IS_NOT_BEARER: `Authorization header is not of type 'Bearer'.`,
  INVALID_AUTH_HEADER_BEARER: `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
  SESSION_NOT_FOUND: 'Session not found.',
  SESSION_ALREADY_EXPIRED: 'Session is already expired.',
  SESSION_EXPIRED: 'Session is expired.',
  USER_NOT_FOUND: 'User not found.',
  TOKEN_EXPIRED: 'Token is expired please try again',
  CONSUMER_USER_PHONE_VERIFIED: `Consumer User's phone is already verified.`,
  LOGOUT_SUCCESS: 'Logout successful.',
  EMAIL_EXIST: 'Entered email already exist in system.',
  PHONE_EXIST: 'Entered phone number already exist in system.',
  PASSWORD_PATTERN_ERROR: `Password must contain at least 1 uppercase letter 1 lowercase letter 1 digit and 1 special character.`,
  SAME_AS_OLD_PASSWORD_ERROR:
    'New password should not be same as current password.',
  USERNAME_EXIST: 'Entered usermame already exist.',
  USERNAME_AVAILABLE: 'Usermame available.',
  PASSWORD_MATCH_ERROR: 'Password and confirm password does not match.',
  TOKEN_IS_EXPIRED: 'Token has been expired. Please try again.',
  INVALID_PASSWORD_ERROR: 'Password is incorrect.',
  ENTER_VALID_OTP: 'Invalid code. Please try again.',
  OTP_IS_EXPIRED: 'OTP has been expired. Please try again.',
  PHONENUMBER_PATTERN_ERROR:
    'Phone numbers must be between 10 and 16 characters.',
  CODE_PATTERN_ERROR: 'Code must be between 1 and 3 characters.',
  SOCIAL_ERROR: 'You have to enter socialId as well as socialType.',
  SOCIAL_MATCH_TYPE: 'Social type does not match.',
  SOCIAL_MATCH_ID: 'Social id does not match.',
  EMAIL_MATCH: 'Email does not match.',
  AUTH_ERROR: 'Authentication token invalid.',
  SOCIAL: 'Please login from your social account',
  EMAIL: 'Please login from your Email Id',
  IS_EXIST:
    'Your Google/Apple account is not connected. Please create an account and connect your Google/Apple account during onboarding.',
};

export const emailMessage = {
  EMAIL_FROM: 'notifications@cardifyiq.com',
  EMAIL_NAME: 'CardifyIQ',
  INFO_EMAIL_FROM: 'info@cardifyiq.com',
  DEMO_EMAIL_FROM: 'demo@cardifyiq.com',
};

export const emailTemplate = {
  REQUEST_DEMO: 'd-87b3c0abc9144aac80422e3d25f8adc8',
  CARD_EXPIRE: 'd-2dc39df80ea9460badc3b0e05043aa3f',
  CERTIFICATE_EXPIRE: 'd-78a947089c124f8a9f63bb077e775d91',
  AFTER_CARD_EXPIRE: 'd-e3986180ab9b4441840c977d99312ff6',
  AFTER_CERTIFICATE_EXPIRE: 'd-389b3aca79fb4ac1bc73cf7a0cd0f752',
};

//------------------------------------------ JEWELLERY MESSAGES ----------------------------------------------------

export const calculatorMessage = {
  CALCULATOR_NOT_FOUND: 'Calculator not found',
  CALCULATOR_IS_DELETED: 'Calculator is deleted',
};

export const sectionImageMessage = {
  SECTION_IMAGE_NOT_FOUND: 'Section image not found',
  SECTION_IMAGE_IS_DELETED: 'Section image is deleted',
};

export const categoryMessage = {
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_IS_DELETED: 'Category is deleted',
};

export const subCategoryMessage = {
  SUB_CATEGORY_NOT_FOUND: 'Sub category not found',
  SUB_CATEGORY_IS_DELETED: 'Sub category is deleted',
};

export const typeMessage = {
  TYPE_NOT_FOUND: 'Type not found',
  TYPE_IS_DELETED: 'Type is deleted',
};

export const collectionMessage = {
  COLLECTION_NOT_FOUND: 'Collection not found',
  COLLECTION_IS_DELETED: 'Collection is deleted',
};

export const jewelleryMessage = {
  JEWELLERY_NOT_FOUND: 'Jewellery not found',
  JEWELLERY_IS_DELETED: 'Jewellery is deleted',
};

export const jewelleryImageMessage = {
  JEWELLERY_IMAGE_NOT_FOUND: 'Jewellery image not found',
  JEWELLERY_IMAGE_IS_DELETED: 'Jewellery image is deleted',
};

export const jewelleryVariantMessage = {
  JEWELLERY_VARIANT_NOT_FOUND: 'Jewellery variant not found',
  JEWELLERY_VARIANT_IS_DELETED: 'Jewellery variant is deleted',
};

export const gemMessage = {
  GEM_NOT_FOUND: 'Gem not found',
  GEM_IS_DELETED: 'Gem is deleted',
};

export const jewelleryCollectionMessage = {
  JEWELLERY_COLLECTION_NOT_FOUND: 'Jewellery collection not found',
  JEWELLERY_COLLECTION_IS_DELETED: 'Jewellery collection is deleted',
};

//------------------------------------------ DIAMOND MESSAGES ----------------------------------------------------

export const diamondVariantMessage = {
  DIAMOND_VARIANT_NOT_FOUND: 'Diamond variant not found',
  DIAMOND_VARIANT_IS_DELETED: 'Diamond variant is deleted',
};

export const diamondPriceMessage = {
  DIAMOND_PRICE_NOT_FOUND: 'Diamond price not found',
  DIAMOND_PRICE_IS_DELETED: 'Diamond price is deleted',
};

export const certificateMessage = {
  CERTIFICATE_NOT_FOUND: 'Certificate not found',
  CERTIFICATE_IS_DELETED: 'Certificate is deleted',
};

export const diamondProductMessage = {
  DIAMOND_PRODUCT_NOT_FOUND: 'Diamond product not found',
  DIAMOND_PRODUCT_IS_DELETED: 'Diamond product is deleted',
};

export const primeProductMessage = {
  PRIME_PRODUCT_NOT_FOUND: 'Prime product not found',
  PRIME_PRODUCT_ALREADY_EXIST: 'Prime product already exists',
  PRIME_PRODUCT_IS_DELETED: 'Prime product is deleted',
  PRIME_PRODUCT_DELETED_SUCCESS: 'Prime product deleted successfully',
  PRIME_PRODUCT_CREATED_SUCCESS: 'Prime product created successfully',
  PRIME_PRODUCT_UPDATED_SUCCESS: 'Prime product updated successfully',
  PRIME_PRODUCT_VALIDATION_FAILED: 'Prime product validation failed',
};

//------------------------------------------ USER RELATED MESSAGES ----------------------------------------------------

export const referenceDetailsMessage = {
  REFERENCE_DETAILS_NOT_FOUND: 'Reference details not found',
  REFERENCE_DETAILS_IS_DELETED: 'Reference details is deleted',
};

export const passwordMessage = {
  PASSWORD_NOT_FOUND: 'Password not found',
  PASSWORD_IS_DELETED: 'Password is deleted',
};

//------------------------------------------ CART & ORDER MESSAGES ----------------------------------------------------

export const cartMessage = {
  CART_NOT_FOUND: 'Cart not found',
  CART_IS_DELETED: 'Cart is deleted',
};

export const cartItemMessage = {
  CART_ITEM_NOT_FOUND: 'Cart item not found',
  CART_ITEM_IS_DELETED: 'Cart item is deleted',
};

export const purchasedOrderMessage = {
  PURCHASED_ORDER_NOT_FOUND: 'Purchased order not found',
  PURCHASED_ORDER_IS_DELETED: 'Purchased order is deleted',
};

export const orderItemMessage = {
  ORDER_ITEM_NOT_FOUND: 'Order item not found',
  ORDER_ITEM_IS_DELETED: 'Order item is deleted',
};

//------------------------------------------ CONTACT & INQUIRY MESSAGES ----------------------------------------------------

export const contactUsMessage = {
  CONTACT_US_NOT_FOUND: 'Contact us not found',
  CONTACT_US_IS_DELETED: 'Contact us is deleted',
};

export const customInquiryMessage = {
  CUSTOM_INQUIRY_NOT_FOUND: 'Custom inquiry not found',
  CUSTOM_INQUIRY_IS_DELETED: 'Custom inquiry is deleted',
};
