import wait from './wait';

beforeAll(() => {
  jest.useFakeTimers();
});

describe('wait', () => {
  it('should resolve only after the specified amount of seconds', async () => {
    const promise = wait(1000);
    jest.advanceTimersByTime(1000);
    expect(promise).resolves.not.toThrow();
  });
});
