import React from 'react';

// ImageCarousel component
export declare function ImageCarousel(): React.JSX.Element;

// LoginForm component
export interface LoginFormProps {
  onSwitchToRegister: () => void;
}
export declare function LoginForm(props: LoginFormProps): React.JSX.Element;

// SignUpForm component
export interface SignUpFormProps {
  onSwitchToLogin: () => void;
}
export declare function SignUpForm(props: SignUpFormProps): React.JSX.Element;
