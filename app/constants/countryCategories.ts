export const COUNTRY_CATEGORIES = {
  SOVEREIGN: 'SOVEREIGN',
  DOMAIN: 'DOMAIN',
  OUTPOST: 'OUTPOST'
} as const;

export type CountryCategory = keyof typeof COUNTRY_CATEGORIES;

// Comprehensive list of country areas in km² with category and active status
export const COUNTRY_DATA: {
  [key: string]: {
    area: number;
    category: CountryCategory;
    active: boolean;
  }
} = {
  // Continents
  'Antarctica': {
    area: 14_200_000,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },

  // Large Countries (>7M km²) - SOVEREIGN
  'Russia': {
    area: 16_376_870,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },
  'China': {
    area: 9_326_410,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },
  'United States': {
    area: 9_147_593,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },
  'Canada': {
    area: 9_093_507,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },
  'Brazil': {
    area: 8_460_415,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },
  'Australia': {
    area: 7_682_300,
    category: COUNTRY_CATEGORIES.SOVEREIGN,
    active: true
  },

  // Medium Countries (2M-7M km²) - DOMAIN
  'Algeria': {
    area: 2_381_741,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Argentina': {
    area: 2_736_690,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Dem. Rep. Congo': {
    area: 2_267_048,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Greenland': {
    area: 2_166_086,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'India': {
    area: 2_973_193,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Kazakhstan': {
    area: 2_699_700,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Saudi Arabia': {
    area: 2_149_690,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Sudan': {
    area: 1_861_484,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Libya': {
    area: 1_759_540,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Iran': {
    area: 1_531_595,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Mongolia': {
    area: 1_553_556,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Indonesia': {
    area: 1_904_569,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Mexico': {
    area: 1_943_945,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Peru': {
    area: 1_279_996,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Chad': {
    area: 1_259_200,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Niger': {
    area: 1_266_700,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Angola': {
    area: 1_246_700,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Mali': {
    area: 1_220_190,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'South Africa': {
    area: 1_214_470,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Colombia': {
    area: 1_109_104,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Ethiopia': {
    area: 1_096_570,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Bolivia': {
    area: 1_083_300,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Mauritania': {
    area: 1_030_700,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },
  'Egypt': {
    area: 995_450,
    category: COUNTRY_CATEGORIES.DOMAIN,
    active: true
  },

  // Small Countries (<2M km²) - OUTPOST
  'Nigeria': {
    area: 910_768,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Venezuela': {
    area: 882_050,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Tanzania': {
    area: 885_800,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Namibia': {
    area: 823_290,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Mozambique': {
    area: 786_380,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Pakistan': {
    area: 770_875,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Turkey': {
    area: 769_632,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Chile': {
    area: 743_812,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Zambia': {
    area: 743_398,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Myanmar': {
    area: 653_508,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Afghanistan': {
    area: 652_230,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Somalia': {
    area: 627_337,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Central African Republic': {
    area: 622_984,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'South Sudan': {
    area: 619_745,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Ukraine': {
    area: 603_548,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Madagascar': {
    area: 581_540,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Botswana': {
    area: 566_730,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Kenya': {
    area: 569_140,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'France': {
    area: 551_695,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Thailand': {
    area: 510_890,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Spain': {
    area: 498_485,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Turkmenistan': {
    area: 469_930,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Cameroon': {
    area: 472_710,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Papua New Guinea': {
    area: 452_860,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Morocco': {
    area: 446_300,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Iraq': {
    area: 434_128,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Uzbekistan': {
    area: 425_400,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Paraguay': {
    area: 397_302,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Zimbabwe': {
    area: 386_847,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Japan': {
    area: 364_485,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Republic of the Congo': {
    area: 341_500,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Germany': {
    area: 348_672,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Malaysia': {
    area: 329_847,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Vietnam': {
    area: 310_070,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Oman': {
    area: 309_500,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Finland': {
    area: 303_815,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Norway': {
    area: 304_282,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Poland': {
    area: 304_255,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Italy': {
    area: 294_140,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Philippines': {
    area: 298_170,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Ecuador': {
    area: 276_841,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Burkina Faso': {
    area: 273_602,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'New Zealand': {
    area: 262_443,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Gabon': {
    area: 257_667,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Guinea': {
    area: 245_717,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'United Kingdom': {
    area: 243_610,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Ghana': {
    area: 227_533,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Romania': {
    area: 229_891,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Laos': {
    area: 230_800,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Uganda': {
    area: 197_100,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Guyana': {
    area: 196_849,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Senegal': {
    area: 192_530,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Kyrgyzstan': {
    area: 191_801,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Syria': {
    area: 183_630,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Cambodia': {
    area: 176_515,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Uruguay': {
    area: 175_015,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Suriname': {
    area: 156_000,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Tunisia': {
    area: 155_360,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Nepal': {
    area: 143_351,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Tajikistan': {
    area: 141_510,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bangladesh': {
    area: 130_170,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Greece': {
    area: 130_647,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Nicaragua': {
    area: 119_990,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'North Korea': {
    area: 120_408,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Benin': {
    area: 114_763,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Honduras': {
    area: 111_890,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bulgaria': {
    area: 108_489,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Guatemala': {
    area: 107_159,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Cuba': {
    area: 103_800,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Iceland': {
    area: 100_250,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'South Korea': {
    area: 99_909,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Liberia': {
    area: 96_320,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Malawi': {
    area: 94_080,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Portugal': {
    area: 91_982,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Hungary': {
    area: 89_608,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Jordan': {
    area: 88_802,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'United Arab Emirates': {
    area: 83_600,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Azerbaijan': {
    area: 82_629,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Austria': {
    area: 82_445,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Serbia': {
    area: 77_474,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Czechia': {
    area: 77_247,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Panama': {
    area: 74_340,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Sierra Leone': {
    area: 71_620,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Georgia': {
    area: 69_700,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Ireland': {
    area: 68_883,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Sri Lanka': {
    area: 61_860,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Latvia': {
    area: 62_249,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Lithuania': {
    area: 62_680,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Croatia': {
    area: 55_974,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Togo': {
    area: 54_385,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bosnia and Herzegovina': {
    area: 51_129,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Costa Rica': {
    area: 51_060,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Slovakia': {
    area: 48_105,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Dominican Republic': {
    area: 48_320,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Estonia': {
    area: 42_388,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Denmark': {
    area: 42_434,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Switzerland': {
    area: 39_997,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bhutan': {
    area: 38_394,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Moldova': {
    area: 32_891,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Taiwan': {
    area: 32_260,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Belgium': {
    area: 30_278,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Lesotho': {
    area: 30_355,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Netherlands': {
    area: 33_893,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Solomon Islands': {
    area: 28_400,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Burundi': {
    area: 27_834,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Haiti': {
    area: 27_560,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Albania': {
    area: 27_398,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Equatorial Guinea': {
    area: 28_051,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Guinea-Bissau': {
    area: 28_120,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Armenia': {
    area: 28_342,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'North Macedonia': {
    area: 25_433,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Rwanda': {
    area: 24_668,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Djibouti': {
    area: 23_180,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Belize': {
    area: 22_806,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Israel': {
    area: 21_497,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'El Salvador': {
    area: 20_721,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Slovenia': {
    area: 20_151,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Fiji': {
    area: 18_272,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Kuwait': {
    area: 17_818,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Eswatini': {
    area: 17_204,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Timor-Leste': {
    area: 14_874,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Montenegro': {
    area: 13_452,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Vanuatu': {
    area: 12_189,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Qatar': {
    area: 11_586,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Jamaica': {
    area: 10_831,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Gambia': {
    area: 10_120,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bahamas': {
    area: 10_010,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Lebanon': {
    area: 10_230,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Cyprus': {
    area: 9_241,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Palestine': {
    area: 6_020,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Brunei': {
    area: 5_265,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Trinidad and Tobago': {
    area: 5_128,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Cabo Verde': {
    area: 4_033,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Luxembourg': {
    area: 2_586,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Samoa': {
    area: 2_821,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Mauritius': {
    area: 2_030,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Comoros': {
    area: 1_862,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Dominica': {
    area: 751,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Tonga': {
    area: 717,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Singapore': {
    area: 709,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Micronesia': {
    area: 702,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Bahrain': {
    area: 786,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Saint Lucia': {
    area: 606,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Kiribati': {
    area: 811,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Sao Tome and Principe': {
    area: 964,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Palau': {
    area: 459,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Andorra': {
    area: 468,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Antigua and Barbuda': {
    area: 443,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Barbados': {
    area: 431,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Saint Vincent and the Grenadines': {
    area: 389,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Grenada': {
    area: 344,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Malta': {
    area: 316,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Maldives': {
    area: 298,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Saint Kitts and Nevis': {
    area: 261,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Marshall Islands': {
    area: 181,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Liechtenstein': {
    area: 160,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'San Marino': {
    area: 61,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Tuvalu': {
    area: 26,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Nauru': {
    area: 21,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Monaco': {
    area: 2,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Vatican City': {
    area: 0.44,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  },
  'Eritrea': {
    area: 101_000,
    category: COUNTRY_CATEGORIES.OUTPOST,
    active: true
  }
};

// Helper function to get all countries in a specific category
export const getCountriesByCategory = (category: CountryCategory) => {
  return Object.entries(COUNTRY_DATA)
    .filter(([_, data]) => data.category === category)
    .map(([name, data]) => ({
      name,
      area: data.area,
      active: data.active
    }));
};

// Helper function to get all active countries
export const getActiveCountries = () => {
  return Object.entries(COUNTRY_DATA)
    .filter(([_, data]) => data.active)
    .map(([name, data]) => ({
      name,
      area: data.area,
      category: data.category
    }));
};