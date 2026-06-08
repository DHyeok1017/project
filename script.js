// ==========================================
// 1. 대용량 데이터베이스 (행정구역 & 다채로운 품목 가이드)
// ==========================================

const localDistricts = {
    "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "부산광역시": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
    "대구광역시": ["군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
    "인천광역시": ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
    "광주광역시": ["광산구", "남구", "동구", "북구", "서구"],
    "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
    "울산광역시": ["남구", "동구", "북구", "울주군", "중구"],
    "세종특별자치시": ["세종특별자치시"],
    "경기도": ["고양시 덕양구", "고양시 일산동구", "고양시 일산서구", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시 분당구", "성남시 수정구", "성남시 중원구", "수원시 권선구", "수원시 영통구", "수원시 장안구", "수원시 팔달구", "시흥시", "안산시 단원구", "안산시 상록구", "안성시", "안양시 동안구", "안양시 만안구", "양주시", "여주시", "오산시", "용인시 기흥구", "용인시 수지구", "용인시 처인구", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "연천군"],
    "강원특별자치도": ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"],
    "충청북도": ["제천시", "청주시 상당구", "청주시 서원구", "청주시 청원구", "청주시 흥덕구", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군"],
    "충청남도": ["계룡시", "공주시", "논산시", "당진시", "보령시", "서산시", "아산시", "천안시 동남구", "천안시 서북구", "금산군", "부여군", "서천군", "청양군", "태안군", "홍성군"],
    "전북특별자치도": ["군산시", "김제시", "남원시", "익산시", "전주시 덕진구", "전주시 완산구", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"],
    "전라남도": ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
    "경상북도": ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시 남구", "포항시 북구", "고령군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"],
    "경상남도": ["거제시", "김해시", "밀양시", "사천시", "양산시", "진주시", "창원시 마산합포구", "창원시 마산회원구", "창원시 성산구", "창원시 의창구", "창원시 진해구", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"],
    "제주특별자치도": ["제주시", "서귀포시"]
};

const regionalRules = {
    "서울특별시-강남구": { tip: "강남구는 투명 페트병 및 비닐 전용 배출 요일제(목요일)를 철저히 적용합니다." },
    "서울특별시-마포구": { tip: "마포구는 스티로폼에 소량의 테이프만 남아있어도 수거하지 않으니 주의하세요." },
    "경기도-수원시 영통구": { tip: "수원시는 음식물 오염이 스며든 컵라면 용기는 무조건 일반 종량제로 배출해야 합니다." },
    "대전광역시-유성구": { tip: "유성구는 소형 가전제품(노트북, 선풍기 등) 5개 미만 배출 시 주민센터 전용 수거함을 이용하세요." }
};

const trashDatabase = {
    plastic: {
        name: "플라스틱/페트",
        items: {
            tteokbokki: {
                name: "배달 떡볶이·마라탕 용기 (PP)",
                defaultType: "플라스틱 재활용",
                baseSteps: ["용기 내부의 남은 음식물을 완전히 비웁니다.", "물로 깨끗이 헹구어 빨간 양념 얼룩을 최대한 지웁니다."],
                dirtySteps: ["햇빛에 말려도 지워지지 않는 고추장/마라 기름 오염이 심한 경우 일반 종량제 봉투로 배출하세요."],
                mixedSteps: ["용기 가장자리에 붙은 밀봉용 비닐 랩이나 스티커를 가위나 칼로 완전히 제거하세요."]
            },
            pet: {
                name: "투명 음료수/생수 페트병",
                defaultType: "투명 페트병 전용 수거함",
                baseSteps: ["내용물을 깨끗이 비우고 물로 안쪽을 헹웁니다.", "라벨지를 완전히 떼어내어 비닐류로 따로 배출합니다.", "발로 밟아 납작하게 압착한 뒤 뚜껑을 닫아 배출합니다."],
                dirtySteps: ["내부에 담배꽁초나 기름 등 이물질이 들어차 세척이 안 되면 일반 종량제 봉투에 버려야 합니다."],
                mixedSteps: ["부착식 라벨 스티커나 잔여 본드가 없도록 깨끗하게 떼어내어 주세요."]
            },
            shampoo: {
                name: "샴푸 / 디스펜서 펌프 통",
                defaultType: "플라스틱 재활용",
                baseSteps: ["통 내부의 잔여 샴푸를 물로 완전히 헹궈냅니다."],
                dirtySteps: ["내부 세척이 불가능한 구조이거나 찌꺼기가 남으면 일반 쓰레기로 버려주세요."],
                mixedSteps: ["펌프 내부 스프링(철)은 분리가 어려우므로, 펌프 헤드 부분은 가위로 잘라 일반쓰레기로 버리고 몸통만 플라스틱으로 배출하세요."]
            }
        }
    },
    paper: {
        name: "종이/종이팩",
        items: {
            box: {
                name: "택배 골판지 박스",
                defaultType: "종이류 재활용",
                baseSteps: ["상자 내부의 완충재(에어캡, 스티로폼)와 영수증을 다 꺼냅니다.", "박스를 납작하게 접어서 종이류 수거함에 놓습니다."],
                dirtySteps: ["물에 젖었거나 기름, 페인트 등이 묻어 오염된 상자는 일반 종량제 봉투에 버리세요."],
                mixedSteps: ["상자에 붙은 박스테이프와 운송장 비닐 스티커를 하나도 없이 전부 뜯어내어 쓰레기통에 버려야 합니다."]
            },
            milk: {
                name: "우유팩 / 두유팩 / 주스팩",
                defaultType: "종이팩 전용 수거함 (또는 주민센터 교환)",
                baseSteps: ["내용물을 완전히 비우고 물로 깨끗이 헹꿉니다.", "가위로 가로지르며 펼쳐서 햇빛에 바짝 말립니다.", "일반 종이류와 섞이지 않게 '종이팩 전용 수거함'에 넣습니다."],
                dirtySteps: ["곰팡이가 피었거나 썩은 찌꺼기가 남은 종이팩은 재활용할 수 없으므로 종량제 봉투에 넣습니다."],
                mixedSteps: ["플라스틱 주입구 뚜껑이 달려있는 두유·주스팩은 뚜껑 부속을 가위로 도려낸 후 배출하세요."]
            },
            receipt: {
                name: "영수증 / 대기표 (감열지)",
                defaultType: "일반 종량제 봉투 (재활용 불가)",
                baseSteps: ["혼합 재질 및 화학 물질(비스페놀A) 코팅으로 인해 재활용이 절대 불가능합니다. 일반 쓰레기로 버리세요."],
                dirtySteps: ["종량제 봉투에 그대로 배출하시면 됩니다."],
                mixedSteps: ["일반 종이류 수거함에 절대 넣지 않도록 주의하세요."]
            }
        }
    },
    can: {
        name: "캔/고철류",
        items: {
            beverage: {
                name: "음료수 알루미늄캔 / 맥주캔",
                defaultType: "캔류 재활용",
                baseSteps: ["캔 속 내용물을 완전히 비우고 물로 가볍게 헹굽니다.", "부피를 줄이기 위해 발로 밟아 납작하게 압착하여 배출합니다."],
                dirtySteps: ["담배꽁초 등 이물질이 들어간 캔은 재활용 품질을 떨어뜨리므로 내부를 완벽히 씻거나 일반쓰레기로 처리합니다."],
                mixedSteps: ["캔 겉면에 붙은 플라스틱 라벨지나 빨대 등 이물질을 완전히 떼어내고 배출하세요."]
            },
            butane: {
                name: "부탄가스 / 스프레이 캔",
                defaultType: "캔류(고철) 재활용",
                baseSteps: ["노즐을 누르고 벽면에 대어 가스를 완전히 빼냅니다.", "통풍이 잘되는 야외에서 캔 펀치나 송곳을 이용해 구멍을 뚫어 잔여 가스를 방출한 뒤 배출합니다."],
                dirtySteps: ["가스가 남아있을 경우 폭발 사고의 원인이 되므로 완벽하게 배출해야 합니다."],
                mixedSteps: ["상단의 플라스틱 뚜껑 분사구 노즐 부품을 분리하여 플라스틱으로 따로 배출하세요."]
            },
            pan: {
                name: "프라이팬 / 냄비",
                defaultType: "고철류 재활용",
                baseSteps: ["음식물 및 탄 자국을 깨끗이 닦아내고 고철류로 배출합니다."],
                dirtySteps: ["코팅이 심하게 벗겨져도 고철 성분은 재활용이 가능합니다."],
                mixedSteps: ["손잡이가 플라스틱이나 나무 재질이더라도 분리가 어려우면 고철류로 통합 배출이 허용됩니다."]
            }
        }
    },
    glass: {
        name: "유리병/유리",
        items: {
            soju: {
                name: "소주병 / 맥주병 / 청량음료병",
                defaultType: "빈용기 보증금 환불 또는 유리 재활용",
                baseSteps: ["소주, 맥주 등 보증금 환불 문구가 있는 병은 대형마트나 편의점에 반납하여 보증금을 돌려받으세요.", "분리배출 시에는 담배꽁초 등 이물질을 넣지 말고 헹군 뒤 유리에 버립니다."],
                dirtySteps: ["내부에 오염물질이 고여 씻기지 않는 병은 재활용이 불가능하므로 불연성 쓰레기 봉투로 처리해야 합니다."],
                mixedSteps: ["병뚜껑(철 또는 플라스틱)은 병과 분리하여 각각의 수거함에 따로 배출해 주세요."]
            },
            broken: {
                name: "깨진 유리 / 유리컵 / 도자기류",
                defaultType: "불연성 마대자루 (특수 종량제)",
                baseSteps: ["깨진 유리는 재활용 선별장에서 수거원에게 부상을 입힙니다. 절대로 유리 수거함에 넣지 마세요.", "신문지에 여러 겹 단단히 짜서 깨진 유리가 밖으로 나오지 않게 한 뒤 마대자루에 넣습니다."],
                dirtySteps: ["양이 아주 적은 소량의 깨진 유리는 신문지에 싸서 일반 종량제 봉투 깊숙이 안전하게 버릴 수 있습니다."],
                mixedSteps: ["사설 수거통이나 일반 재활용 유리병과 절대 혼합 배출하지 마세요."]
            }
        }
    },
    vinyl: {
        name: "비닐류",
        items: {
            snack: {
                name: "과자 봉지 / 라면 봉지 / 리필용 팩",
                defaultType: "비닐류 재활용",
                baseSteps: ["봉지 안의 과자 부스러기나 수프 가루를 깨끗이 털어냅니다.", "바람에 날아가지 않도록 투명 비닐봉투에 모아서 배출합니다."],
                dirtySteps: ["수프나 양념 기름이 가득 묻어 물로 헹궈지지 않는 비닐은 일반 종량제 봉투에 버리셔야 합니다."],
                mixedSteps: ["겉면에 붙은 택배 송장 스티커나 가격표 테이프를 가위로 오려내거나 떼어낸 후 배출하세요."]
            },
            aircap: {
                name: "뽁뽁이 (에어캡) / 배달 완충재",
                defaultType: "비닐류 재활용",
                baseSteps: ["공기가 들어있는 에어캡은 그대로 혹은 터뜨려서 비닐류 전용 수거함으로 배출합니다."],
                dirtySteps: ["이물질이 묻지 않은 투명한 상태여야 재활용 효율이 높습니다."],
                mixedSteps: ["에어캡 위에 붙은 테이프는 접착 성분이 남지 않도록 완벽히 가위로 도려내고 비닐만 버려주세요."]
            }
        }
    },
    general: {
        name: "일반/기타 쓰레기",
        items: {
            bone: {
                name: "치킨 뼈 / 갈비 뼈 / 조개 껍데기",
                defaultType: "일반 종량제 봉투",
                baseSteps: ["동물의 뼈와 조개, 전복, 게 껍데기, 달걀 껍질은 단단하여 동물 사료로 쓸 수 없으므로 음식물이 아닙니다.", "물기를 빼고 일반 종량제 봉투에 담아 배출합니다."],
                dirtySteps: ["뼈에 붙은 살코기는 최대한 발라내어 살코기는 음식물로, 뼈는 일반쓰레기로 분류합니다."],
                mixedSteps: ["음식물 쓰레기통에 혼합하여 배출할 경우 과태료가 부과될 수 있습니다."]
            },
            battery: {
                name: "폐건전지 / 보조배터리",
                defaultType: "폐건전지 전용 수거함",
                baseSteps: ["수명이 다한 건전지 및 리튬 배터리는 종량제 봉투에 버리면 화재를 유발합니다.", "아파트 단지나 주민센터에 마련된 '폐건전지 전용 수거함'에 넣습니다."],
                dirtySteps: ["부식되거나 녹이 슨 건전지도 전용 수거함에 안전하게 배출 가능합니다."],
                mixedSteps: ["기기에서 건전지를 완전히 분리한 상태로 알맹이만 전용 함에 넣어주세요."]
            },
            medicine: {
                name: "기한 지난 약 / 폐의약품",
                defaultType: "폐의약품 전용 수거함 (약국/보건소)",
                baseSteps: ["먹다 남은 약은 싱크대나 변기, 종량제 봉투에 버리면 토양 생태계를 교란합니다.", "인근 약국, 보건소, 주민센터의 폐의약품 수거함에 가져다주세요."],
                dirtySteps: ["약 자체만 따로 모아서 가져가시는 것이 정석입니다."],
                mixedSteps: ["알약 비닐 포장지(PTP)나 종이 상자는 약과 분리하여 껍데기만 재활용으로 버리고 약 알맹이만 모아 전달합니다."]
            }
        }
    }
};

// ==========================================
// 2. 앱 상태 관리 변수 (State)
// ==========================================
let currentRegion = "";
let currentDistrict = "";
let currentCategory = "";
let currentItem = "";

// ==========================================
// 3. DOM 요소 셀렉터
// ==========================================
const selectRegion = document.getElementById("select-region");
const selectDistrict = document.getElementById("select-district");
const btnGps = document.getElementById("btn-gps");
const locationStatus = document.getElementById("location-status");

const stepCategory = document.getElementById("step-category");
const categoryTabs = document.getElementById("category-tabs");
const selectTrashItem = document.getElementById("select-trash-item");

const stepCondition = document.getElementById("step-condition");
const btnAnalyze = document.getElementById("btn-analyze");

const stepResult = document.getElementById("step-result");
const resultTitle = document.getElementById("result-title");
const resultDisposalType = document.getElementById("result-disposal-type");
const guideSteps = document.getElementById("guide-steps");
const resultLocalTip = document.getElementById("result-local-tip");
const resultTipBox = document.getElementById("result-tip-box");
const btnReset = document.getElementById("btn-reset");

// ==========================================
// 4. 앱 구동 로직 & 이벤트 핸들러
// ==========================================

// 앱 초기화 실행
function initApp() {
    // 시도 셀렉트 옵션 추가
    selectRegion.innerHTML = '<option value="">시/도 선택</option>';
    Object.keys(localDistricts).forEach(sido => {
        const option = document.createElement("option");
        option.value = sido;
        option.textContent = sido;
        selectRegion.appendChild(option);
    });

    // 카테고리 탭 동적 생성
    categoryTabs.innerHTML = "";
    Object.keys(trashDatabase).forEach(key => {
        const button = document.createElement("button");
        button.className = "tab-btn";
        button.textContent = trashDatabase[key].name;
        button.dataset.category = key;
        button.addEventListener("click", (e) => selectCategoryTab(key, e.target));
        categoryTabs.appendChild(button);
    });
}

// 시/도 타겟팅 변경 이벤트
selectRegion.addEventListener("change", (e) => {
    const region = e.target.value;
    currentRegion = region;
    currentDistrict = "";
    
    selectDistrict.innerHTML = '<option value="">시/군/구 선택</option>';
    stepCategory.classList.add("disabled");
    stepCondition.classList.add("disabled");
    resetSelectedCategory();

    if (!region) {
        selectDistrict.disabled = true;
        return;
    }

    // 종속된 시군구 데이터 렌더링
    selectDistrict.disabled = false;
    localDistricts[region].forEach(dist => {
        const option = document.createElement("option");
        option.value = dist;
        option.textContent = dist;
        selectDistrict.appendChild(option);
    });
});

// 시군구 최종 타겟 선택 이벤트
selectDistrict.addEventListener("change", (e) => {
    currentDistrict = e.target.value;
    if (currentDistrict) {
        locationStatus.innerHTML = `📍 <strong>설정된 지역:</strong> ${currentRegion} ${currentDistrict}`;
        stepCategory.classList.remove("disabled");
    } else {
        stepCategory.classList.add("disabled");
    }
});

// Geolocation GPS 코어 기능 구현
btnGps.addEventListener("click", () => {
    locationStatus.textContent = "🔄 현재 GPS 신호를 잡고 위치를 파악하는 중입니다...";
    
    if (!navigator.geolocation) {
        locationStatus.textContent = "❌ 이 브라우저 또는 환경에서는 GPS 기능을 지원하지 않습니다.";
        return;
    }

    const gpsOptions = {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // 데모 및 범용 프로젝트 호환용 역지오코딩 시뮬레이션 인터페이스
            let simulatedSido = "서울특별시";
            let simulatedSigungu = "마포구";
            
            if (lat > 36.0 && lat < 37.0) {
                simulatedSido = "대전광역시";
                simulatedSigungu = "유성구";
            }

            selectRegion.value = simulatedSido;
            currentRegion = simulatedSido;
            
            selectDistrict.innerHTML = '<option value="">시/군/구 선택</option>';
            selectDistrict.disabled = false;
            localDistricts[simulatedSido].forEach(dist => {
                const option = document.createElement("option");
                option.value = dist;
                option.textContent = dist;
                selectDistrict.appendChild(option);
            });

            selectDistrict.value = simulatedSigungu;
            currentDistrict = simulatedSigungu;

            locationStatus.innerHTML = `📍 <strong>GPS 수신 성공:</strong> ${simulatedSido} ${simulatedSigungu} (위도:${lat.toFixed(4)}, 경도:${lon.toFixed(4)})`;
            stepCategory.classList.remove("disabled");
            stepCategory.scrollIntoView({ behavior: 'smooth' });
        },
        (error) => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    locationStatus.textContent = "❌ 위치 정보 권한이 거부되었습니다. 직접 선택해 주세요.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    locationStatus.textContent = "❌ 위치 정보를 사용할 수 없습니다. 직접 선택해 주세요.";
                    break;
                case error.TIMEOUT:
                    locationStatus.textContent = "❌ 위치 정보 확인 시간 초과. 직접 선택해 주세요.";
                    break;
                default:
                    locationStatus.textContent = "❌ GPS 오류 발생. 직접 주소를 선택해 주세요.";
                    break;
            }
        }, 
        gpsOptions
    );
});

// 카테고리 선택 핸들러
function selectCategoryTab(categoryKey, targetElement) {
    currentCategory = categoryKey;
    currentItem = "";
    
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    targetElement.classList.add("active");

    selectTrashItem.disabled = false;
    selectTrashItem.innerHTML = '<option value="">쓰레기 종류를 선택하세요</option>';
    
    const items = trashDatabase[categoryKey].items;
    Object.keys(items).forEach(itemKey => {
        const option = document.createElement("option");
        option.value = itemKey;
        option.textContent = items[itemKey].name;
        selectTrashItem.appendChild(option);
    });

    stepCondition.classList.add("disabled");
}

function resetSelectedCategory() {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    selectTrashItem.innerHTML = '<option value="">쓰레기 종류를 선택하세요</option>';
    selectTrashItem.disabled = true;
}

selectTrashItem.addEventListener("change", (e) => {
    currentItem = e.target.value;
    if (currentItem) {
        stepCondition.classList.remove("disabled");
    } else {
        stepCondition.classList.add("disabled");
    }
});

// 알고리즘 분석기 가동 및 가이드 도출
btnAnalyze.addEventListener("click", () => {
    if (!currentCategory || !currentItem) {
        alert("분석할 쓰레기 종류를 최종 선택해주세요!");
        return;
    }

    const itemData = trashDatabase[currentCategory].items[currentItem];
    const isDirty = document.querySelector('input[name="contamination"]:checked').value === "dirty";
    const isMixed = document.getElementById("check-mixed").checked;

    resultTitle.textContent = itemData.name;
    resultDisposalType.textContent = itemData.defaultType;

    guideSteps.innerHTML = "";
    let finalSteps = [...itemData.baseSteps];

    if (isMixed) {
        finalSteps.push(...itemData.mixedSteps);
    }
    if (isDirty) {
        finalSteps.push(...itemData.dirtySteps);
        resultDisposalType.textContent = "일반 종량제 봉투 배출";
        resultDisposalType.style.backgroundColor = "var(--danger-color)";
    } else {
        resultDisposalType.style.backgroundColor = "var(--success-color)";
    }

    finalSteps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        guideSteps.appendChild(li);
    });

    // 지자체 커스텀 팁 조건 검사 및 렌더링
    const localKey = `${currentRegion}-${currentDistrict}`;
    if (regionalRules[localKey]) {
        resultTipBox.classList.remove("hidden");
        resultLocalTip.textContent = regionalRules[localKey].tip;
    } else {
        resultTipBox.classList.remove("hidden");
        resultLocalTip.textContent = `${currentRegion} ${currentDistrict}의 기본 수거 지침을 따릅니다. 스티커가 필요한 대형 폐기물은 구청 홈페이지에서 신고 후 배출해 주세요.`;
    }

    stepResult.classList.remove("hidden");
    stepResult.scrollIntoView({ behavior: 'smooth' });
});

// 처음으로 (Reset) 버튼 이벤트
btnReset.addEventListener("click", () => {
    stepResult.classList.add("hidden");
    stepCondition.classList.add("disabled");
    stepCategory.classList.add("disabled");
    
    selectRegion.value = "";
    selectDistrict.innerHTML = '<option value="">시/군/구 선택</option>';
    selectDistrict.disabled = true;
    
    resetSelectedCategory();
    
    document.getElementById("check-mixed").checked = false;
    document.querySelector('input[name="contamination"][value="clean"]').checked = true;
    locationStatus.textContent = "지역을 설정하면 해당 지자체의 가이드라인이 적용됩니다.";
    
    currentRegion = ""; currentDistrict = ""; currentCategory = ""; currentItem = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 앱 초기 기동 시 데이터 인젝션
initApp();
