// ==========================================
// 1. 가상 데이터베이스 (데이터 확장 가능 구조)
// ==========================================

// 지역별 시군구 데이터
const localDistricts = {
    seoul: ["강남구", "마포구", "서초구", "종로구"],
    gyeonggi: ["수원시", "성남시", "고양시", "용인시"]
};

// 지자체별 특이사항 가이드 (예시 데이터)
const regionalRules = {
    "seoul-강남구": { tip: "강남구는 투명 페트병 분리배출 요일제(목요일)를 시행 중입니다." },
    "seoul-마포구": { tip: "마포구는 소량의 스티로폼도 완전히 흰색이 아니면 종량제 봉투 배출이 원칙입니다." },
    "gyeonggi-수원시": { tip: "수원시는 배달 용기에 물든 고추장 양념이 안 지워지면 일반 쓰레기로 분류합니다." }
};

// 쓰레기 카테고리 및 아이템 가이드 데이터 (내손안의 분리배출 기준 가이드라인 맵핑)
const trashDatabase = {
    plastic: {
        name: "플라스틱/비닐",
        items: {
            tteokbokki: {
                name: "배달 떡볶이 용기 (PP)",
                defaultType: "플라스틱 재활용",
                baseSteps: ["내용물을 깨끗이 비웁니다.", "물로 헹구어 양념 및 오염을 제거합니다."],
                dirtySteps: ["씻어도 지워지지 않는 오염(붉은 고추장 실트 등)이 남은 경우 일반 쓰레기(종량제)로 배출하세요."],
                mixedSteps: ["용기에 붙은 비닐 랩이나 스티커 테이프를 칼로 완전히 제거한 뒤 배출하세요."]
            },
            pet: {
                name: "투명 페트병",
                defaultType: "투명 페트병 전용",
                baseSteps: ["내용물을 완전히 비우고 물로 헹굽니다.", "라벨지를 떼어내어 비닐류로 따로 배출합니다.", "꽉 압착한 뒤 뚜껑을 닫아서 전용 수거함에 넣습니다."],
                dirtySteps: ["오염이 심해 세척이 불가능하면 일반쓰레기로 버리세요."],
                mixedSteps: ["부착된 라벨 스티커를 깨끗하게 박리해 주세요."]
            }
        }
    },
    styrofoam: {
        name: "스티로폼",
        items: {
            box: {
                name: "택배 스티로폼 상자",
                defaultType: "스티로폼 재활용",
                baseSteps: ["상자 안의 내용물을 완전히 비웁니다."],
                dirtySteps: ["테이프나 아이스팩, 오염물질이 묻은 스티로폼은 재활용이 안 되므로 쪼개서 종량제 봉투에 넣거나 대형폐기물로 처리하세요."],
                mixedSteps: ["표면에 붙은 택배 송장 스티커와 박스테이프를 전부 뜯어내야 재활용이 가능합니다."]
            }
        }
    },
    paper: {
        name: "종이/박스",
        items: {
            pizza: {
                name: "피자 상자",
                defaultType: "종이류 재활용",
                baseSteps: ["상자 내부의 영수증, 플라스틱 고정 핀을 제거합니다.", "납작하게 접어서 배출합니다."],
                dirtySteps: ["피자 기름이나 기름때가 심하게 묻은 바닥 부분은 가위로 잘라내어 일반쓰레기로 버리고, 깨끗한 뚜껑 부분만 종이로 배출하세요."],
                mixedSteps: ["붙어있는 테이프와 운송장을 모두 제거해주세요."]
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
// 4. 이벤트 리스너 및 핵심 로직
// ==========================================

// [초기화] 대분류 카테고리 탭 생성
function initCategoryTabs() {
    categoryTabs.innerHTML = "";
    Object.keys(trashDatabase).forEach(key => {
        const button = document.createElement("button");
        button.className = "tab-btn";
        button.textContent = trashDatabase[key].name;
        button.dataset.category = key;
        button.addEventListener("click", () => selectCategoryTab(key));
        categoryTabs.appendChild(button);
    });
}

// [STEP 1] 지역 선택 처리
selectRegion.addEventListener("change", (e) => {
    const region = e.target.value;
    currentRegion = region;
    
    if (!region) {
        selectDistrict.disabled = true;
        selectDistrict.innerHTML = '<option value="">시/군/구 선택</option>';
        return;
    }

    // 시군구 데이터 매핑
    selectDistrict.disabled = false;
    let options = '<option value="">시/군/구 선택</option>';
    localDistricts[region].forEach(dist => {
        options += `<option value="${dist}">${dist}</option>`;
    });
    selectDistrict.innerHTML = options;
});

selectDistrict.addEventListener("change", (e) => {
    currentDistrict = e.target.value;
    if (currentDistrict) {
        locationStatus.textContent = `📍 설정된 지역: ${selectRegion.options[selectRegion.selectedIndex].text} ${currentDistrict}`;
        stepCategory.classList.remove("disabled"); // 다음 스텝 활성화
    }
});

// GPS 기능 (가상 구현 - 성공 시 가상의 시나리오 적용)
btnGps.addEventListener("click", () => {
    locationStatus.textContent = "🔄 현재 위치 확인 중...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // 실제 프로젝트 시 위경도를 카카오/구글 API를 통해 행정구역명으로 변환하는 로직이 들어갈 자리입니다.
            // 여기서는 팀 프로젝트 데모용 뼈대로 가상 매핑 처리합니다.
            selectRegion.value = "seoul";
            currentRegion = "seoul";
            
            // 시군구 강제 로드
            selectDistrict.disabled = false;
            let options = '<option value="">시/군/구 선택</option>';
            localDistricts["seoul"].forEach(dist => options += `<option value="${dist}">${dist}</option>`);
            selectDistrict.innerHTML = options;
            
            selectDistrict.value = "마포구";
            currentDistrict = "마포구";
            
            locationStatus.textContent = "📍 GPS 매핑 완료: 서울특별시 마포구";
            stepCategory.classList.remove("disabled");
        }, () => {
            locationStatus.textContent = "❌ GPS 권한을 거부하셨거나 오류가 발생했습니다. 직접 선택해주세요.";
        });
    } else {
        locationStatus.textContent = "❌ 이 브라우저는 GPS 기능을 지원하지 않습니다.";
    }
});

// [STEP 2] 카테고리 탭 클릭 시 소분류 드롭다운 갱신
function selectCategoryTab(categoryKey) {
    currentCategory = categoryKey;
    
    // 탭 하이라이트 전환
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    // 소분류 데이터 뿌리기
    selectTrashItem.disabled = false;
    let options = '<option value="">쓰레기 종류를 선택하세요</option>';
    const items = trashDatabase[categoryKey].items;
    
    Object.keys(items).forEach(itemKey => {
        options += `<option value="${itemKey}">${items[itemKey].name}</option>`;
    });
    selectTrashItem.innerHTML = options;
    stepCondition.classList.remove("disabled");
}

selectTrashItem.addEventListener("change", (e) => {
    currentItem = e.target.value;
});

// [STEP 3 & 4] 최종 가이드라인 분석 가동
btnAnalyze.addEventListener("click", () => {
    if (!currentCategory || !currentItem) {
        alert("쓰레기 종류를 최종 선택해주세요!");
        return;
    }

    const itemData = trashDatabase[currentCategory].items[currentItem];
    const isDirty = document.querySelector('input[name="contamination"]:checked').value === "dirty";
    const isMixed = document.getElementById("check-mixed").checked;

    // 결과 창 바인딩
    resultTitle.textContent = itemData.name;
    resultDisposalType.textContent = itemData.defaultType;

    // 순차적 가이드라인 빌드업
    guideSteps.innerHTML = "";
    let finalSteps = [...itemData.baseSteps];

    if (isMixed) {
        finalSteps.push(...itemData.mixedSteps);
    }
    if (isDirty) {
        finalSteps.push(...itemData.dirtySteps);
        resultDisposalType.textContent = "일반 종량제 봉투";
        resultDisposalType.style.backgroundColor = "#e63946";
    } else {
        resultDisposalType.style.backgroundColor = "#2a9d8f";
    }

    // 최종 스텝 DOM 노출
    finalSteps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        guideSteps.appendChild(li);
    });

    // 지자체별 특이사항 매핑
    const localKey = `${currentRegion}-${currentDistrict}`;
    if (regionalRules[localKey]) {
        resultTipBox.classList.remove("hidden");
        resultLocalTip.textContent = regionalRules[localKey].tip;
    } else {
        resultTipBox.classList.add("hidden");
    }

    // 결과 스크롤 이동 및 보이기
    stepResult.classList.remove("hidden");
    stepResult.scrollIntoView({ behavior: 'smooth' });
});

// 초기화 리셋 버튼
btnReset.addEventListener("click", () => {
    stepResult.classList.add("hidden");
    stepCondition.classList.add("disabled");
    stepCategory.classList.add("disabled");
    
    selectRegion.value = "";
    selectDistrict.innerHTML = '<option value="">시/군/구 선택</option>';
    selectDistrict.disabled = true;
    selectTrashItem.innerHTML = '<option value="">쓰레기 종류를 선택하세요</option>';
    selectTrashItem.disabled = true;
    
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById("check-mixed").checked = false;
    document.querySelector('input[name="contamination"][value="clean"]').checked = true;
    locationStatus.textContent = "지역을 설정하면 해당 지자체의 가이드라인이 적용됩니다.";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 앱 로드 시 실행
initCategoryTabs();
