import queryEvent from './event';
import { search } from '@millenmortier/scholarly';

jest.useFakeTimers();
jest.mock('@millenmortier/scholarly');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('queryEvent', () => {
  it("should return an EventEmitter that emits 'data' whenever new data is received, and 'done' when it's done", (done) => {
    (search as jest.Mock).mockResolvedValue([]);
    (search as jest.Mock).mockResolvedValueOnce([
      { title: 'Article 1' },
      { title: 'Article 2' },
    ]);
    (search as jest.Mock).mockResolvedValueOnce([
      { title: 'Article 3' },
      { title: 'Article 4' },
    ]);

    const emitter = queryEvent('Some search query');

    emitter.on('data', (newResults) => {
      expect(newResults).toHaveLength(2);
    });

    emitter.on('end', () => {
      done();
    });
  });

  it("should emit 'error' whenever the Google Scholar request fails", (done) => {
    (search as jest.Mock).mockRejectedValueOnce(new Error());

    const emitter = queryEvent('Some search query');

    emitter.on('error', () => {
      done();
    });
  });

  it("should emit 'tooManyRequests' whenever Google Scholar rate limits us", (done) => {
    (search as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 429,
      },
    });

    const emitter = queryEvent('Some search query');

    emitter.on('tooManyRequests', () => {
      done();
    });
  });
});
