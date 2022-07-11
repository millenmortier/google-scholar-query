import queryPromise from './promise';
import { search } from '@millenmortier/scholarly';

jest.mock('@millenmortier/scholarly');

beforeEach(() => {
  jest.resetAllMocks();

  (search as jest.Mock).mockResolvedValue([]);
  (search as jest.Mock).mockResolvedValueOnce([
    { title: 'article 1' },
    { title: 'article 2' },
  ]);
  (search as jest.Mock).mockResolvedValueOnce([
    { title: 'article 3' },
    { title: 'article 4' },
  ]);
  (search as jest.Mock).mockResolvedValueOnce([
    { title: 'article 5' },
    { title: 'article 6' },
  ]);
});

describe('queryPromise', () => {
  it(`should call Google Scholar until it doesn't find results anymore`, async () => {
    const query = 'Some Google Scholar query';
    const results = await queryPromise(query);
    expect(results).toHaveLength(6);
  });

  it('should not return more than the specified limit', async () => {
    const query = 'Some Google Scholar query';
    const results = await queryPromise(query, 4);
    expect(results).toHaveLength(4);
  });
});
