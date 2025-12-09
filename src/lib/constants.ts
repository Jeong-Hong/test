export const PRODUCTS_BY_MACHINE: Record<string, string[]> = {
    'G60': [
        '아메리칸 캐쥬얼',
        '다크 댄디',
        '코튼 캔디',
        '콜롬비아'
    ],
    'P25': [
        '스페셜',
        '디카페인',
        '카페 타샤',
        '검을 현',
        '모카비',
        '카페 잇',
        '플랫 커스텀',
        '블랙 슈가',
        '앤드앤 클래식',
        '앤드앤 오리지널',
        '앤드엔 시그니처',
        '백성민 R'
    ],
    'L12': [
        '스타 클래식',
        '오렌지 빈티지',
        '코튼 캔디',
        '레드베리',
        '백성 민',
        '브릭 초콜릿',
        '메이플 레드',
        '딥 노트',
        '넛티 로스트',
        '콜롬비아',
        '브라질',
        '에티오피아 G2 W',
        '에티오피아 G1 N',
        '케냐',
        '인도네시아',
        '베트남',

    ]
};

// 기본값으로 첫 번째 항목을 사용하기 위한 헬퍼
export const getDefaultProduct = (machine: string): string => {
    const products = PRODUCTS_BY_MACHINE[machine];
    return products && products.length > 0 ? products[0] : '';
};
