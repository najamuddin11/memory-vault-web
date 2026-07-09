export default interface ValidationErrorType {
  data?: {
    validationErrors?: {
      name?: string;
      email?: string;
      message?: string;
      company?: string;
    };
  };
}
