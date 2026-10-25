// export const DEFAULT_OTP = '123456';
// export const SEND_OTP = false;
// export const REQUIRE_LOGIN_OTP = false;
// export const RESET_DATA_PIN = '998877';
// export const ADMIN_TIMEZONE = `GMT`;

// export const ADMIN_DATE_FORMAT = `dd-MM-yyyy`;
export const MAX_FIND_ALL_LIMIT = 50;

export const DATE_SETTINGS = {
  DEFAULT_TZ: 'america/chicago',
  DEFAULT_START_TIME: '08:00:00',
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm:ss',
  DATE_TIME_FORMAT: 'YYYY-MM-DD 00:00:00',
  DATE: '2022-12-31',
  TIME: '23:59:59',
  DATE_TIME: '2022-12-31 23:59:59',
  INVALID_DATE: 'Invalid Date',
  INVALID_TIME: 'Invalid Time',
  INVALID_DATE_TIME: 'Invalid Date Time',
  COMPARE_TIME: 'From time can not be grater than to time',
  COMPARE_DATE: 'From date can not be grater than to date',
  FUTURE_DATE: 'Event date must be a future date',
  SHIFT_FUTURE_DATE: 'Shift date time must be a future',
  FUTURE_TIME: 'Event time must be a future time',
  SHIFT_FUTURE_TIME: 'Shift date time must be a future',
  PAST_DATE: 'DOB date must be a past date',
  FUTURE: 'Please enter future date',
  COMPARE_DATE_TIME: 'From date time can not be grater than to date time',
  DATE_TIME_MONTH: 'LLL dd hh:mm a',
  DATE_TIME_: 'hh:mm a',
};

export const COMMON_ERROR_MESSAGES = {
  NOT_FOUND: 'Not Found',
  INVALID_DATE: 'Invalid Date',
  INVALID_START_DATE: 'Invalid Start Date',
  INVALID_END_DATE: 'Invalid End Date',
  INVALID_OTP_REFERENCE: 'invalid OTP reference.',
  INVALID_COUNTRY_CODE: 'Invalid Country Code.',
  INVALID_PHONE: 'Invalid Phone Number.',
  COUNTRY_CODE_REQUIRED: 'Country Code can not be blank.',
  PHONE_REQUIRED: 'Phone Number can not be blank.',
  EMAIL_REQUIRED: 'Email can not be blank.',
  COUNTRY_CODE_LENGTH: 'Country Code can not be more than 3 digit.',
  PHONE_LENGTH: 'Phone Number can not be more than 10 digit.',
  PASSWORD_PATTERN_ERROR:
    'Password must contain at least 1 uppercase letter 1 lowercase letter 1 digit and 1 special character.',
  INVALID_EMAIL: 'Invalid email address.',
  PASSWORD_MATCH_ERROR: 'Password and confirm password does not match.',
  TOKEN_IS_EXPIRED: 'Password reset link is expired. Please try again',
  SOMETHING_WENT_WRONG: 'Something went wrong please try again',
};

export const COMMON_DEFAULT_DATA = {
  PHONE: '1234567890',
  CODE: '+91',
  PHONECODE: '+1',
  EMAIL:
    process.env.ENV !== 'PRODUCTION'
      ? 'squaretest0104@gmail.com'
      : 'contact@likeplan.com',
};
