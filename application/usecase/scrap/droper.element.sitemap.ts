export const DROPER_BASE_URL = 'https://droper.app/'
export enum SitemapRef {
    initUrl = `${DROPER_BASE_URL}/buscar/`,
    loadMoreSelector = 'button[ng-click="moreDropsV4()"]',
    openFiltersSelector = 'button[ng-click="openFiltros()"]',
    openOrdernationTypeSelector = `div[ng-click="toggleIsExpandido('ordenacao')"]`,
    mostExpansiveOrdernationTypeSelector = `label[for="radio-maiorprecoordenacao"]`,
    openCategoryTypeSelector = `div[ng-click="toggleIsExpandido('categoria')"]`,
    categoryTypeSelector = `label[for="radio-1tipoproduto"]`, //tenis
    closeFilterSelector = `button[ng-click="closeFiltros()"]`,
    searchFieldSelector = `form[name="buscar-mobile"] input`,
    productCellSelector = '.flex-xs_50.flex-sm_33.flex-md_33.flex_25.ng-scope',
    productCellHeaderSelector = '.ck-link.nm.text-semibold.text-size-14px.ng-binding',
    datailsSeeMoreButton = 'button.md-button-xs.mt10.md-button.md-ink-ripple',
    datailsSinglePageTitle = 'span.text-size-14px.text-bold.text-muted.nm.mb5',
    datailsSinglePage = 'div.text-left.pl20',
    datailsSinglePageBox = 'div.ck-box--radius.ck-box--shadow__3px.bg-white.mt20.pt30.pb20.layout-wrap.layout-align-start-center.layout-row',
    imageElementSinglePage = 'img.ck-pointer.ng-isolate-scope',
    nameElementSinglePage = 'h1.text-semimuted.text-bold.pl15.pr15.mb30.ng-binding.text-left.text-size-38px',
    priceElementSinglePage = 'h2.text-size-48px.nm.text-semimuted.ng-binding.ng-scope',
    descriptionElementSinglePage = 'p#drop-descricao',
}
export type SinglePageDataOutput = {
    name: string
    price: string
    description: string
    imageLinks: string[]
    details: SinglePageDetailsDataOutput
}

export type SinglePageDetailsDataOutput = {
    sku: string | null
    releaseDate: string | null
    brand: string | null
    silhouette: string | null
    releasePrice: string | null
    color: string | null
}

export const SinglePageDetailsElementsMapRef: {
    [key: string]: {
        keyRef: string;
        elementValueRef: string;
    }
} = {
    LANCAMENTO: {
        keyRef: 'releaseDate',
        elementValueRef: 'p.text-semibold.text-semimuted.nm.text-size-18px.text-uppercase.ng-binding'
    },
    SKU: {
        keyRef: 'sku',
        elementValueRef: 'h3.text-semibold.text-semimuted.nm.text-size-18px.ng-binding'
    },
    MARCA: {
        keyRef: 'brand',
        elementValueRef: 'a.text-semibold.text-semimuted.nm.text-size-18px.ng-binding'
    },
    SILHUETA: {
        keyRef: 'silhouette',
        elementValueRef: 'a.text-semibold.text-semimuted.nm.text-size-18px.ng-binding'
    },
    PRECODELANCAMENTO: {
        keyRef: 'releasePrice',
        elementValueRef: 'p.text-semibold.text-semimuted.nm.text-size-18px.text-nowrap.ng-binding'
    },
    COR: {
        keyRef: 'color',
        elementValueRef: 'div[ng-if="dados.drop.cores && dados.drop.cores.length > 0"] h3.text-semibold.text-semimuted.nm.text-size-18px.ng-binding'
    }
}