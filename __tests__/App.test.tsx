import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders Hello World text', () => {
    const {getByText} = render(<App />);
    expect(getByText('Hello World')).toBeTruthy();
  });
});
