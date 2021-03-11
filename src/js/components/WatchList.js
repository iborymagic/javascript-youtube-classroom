import { $, renderSkeletonUI, clearElement, formatDate } from '../utils.js';
import { SELECTORS, LOCAL_STORAGE_KEYS } from '../constants.js';
import { searchYoutubeById } from '../api.js';
import Observer from '../lib/Observer.js';

export default class WatchList extends Observer {
  constructor(store) {
    super();
    this.store = store;
    this.selector = SELECTORS.CLASS.WATCH_LIST;
    this.list = this.store.get().watchList;
  }

  renderSavedVideos = (items) => {
    const resultTemplate = items
      .map((item) => {
        const { channelId, title, channelTitle, publishedAt } = item.snippet;
        const { id } = item;

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = new Date(publishedAt).toLocaleDateString('ko-KR', options);
        // const dateString = formatDate(publishedAt);

        $(SELECTORS.CLASS.WATCH_LIST).insertAdjacentHTML(
          'beforeend',
          `<article class="clip d-flex flex-col">
            <div class="preview-container">
              <iframe
                width="100%"
                height="118"
                src="https://www.youtube.com/embed/${id}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
            <div class="content-container pt-2 px-1 d-flex flex-col justify-between flex-1">
              <div>
                <h3 class="video-title">${title}</h3>
                <a
                  href="https://www.youtube.com/channel/${channelId}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="channel-name mt-1"
                >
                  ${channelTitle}
                </a>
                <div class="meta">
                  <p>${dateString}</p>
                </div>
                <div>
                  <span class="opacity-hover">✅</span>
                  <span class="opacity-hover">👍</span>
                  <span class="opacity-hover">💬</span>
                  <span class="opacity-hover">🗑️</span>
                </div>
              </div>
            </div>
          </article>`
        );
      })
      .join('');

    $(SELECTORS.CLASS.WATCH_LIST).insertAdjacentHTML('beforeend', resultTemplate);
  };

  async render() {
    const watchList = this.store.load(LOCAL_STORAGE_KEYS.WATCH_LIST);
    if (!watchList || watchList.length <= 0) return;

    renderSkeletonUI(SELECTORS.CLASS.WATCH_LIST, watchList.length);
    const { items } = await searchYoutubeById(watchList);
    clearElement(SELECTORS.CLASS.WATCH_LIST);

    this.renderSavedVideos(items);
  }

  async update() {
    console.log('watchList update');
    const { watchList } = this.store.get();

    const newVideoId = watchList.filter((id) => !this.list.includes(id));
    if (!newVideoId || newVideoId.length <= 0) return;
    const { items } = await searchYoutubeById([newVideoId]);

    this.renderSavedVideos(items);
    this.list = watchList;
  }
}
