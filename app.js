// ====== Scenario Data (Decision-based, non-technical) ======
const rounds = [
  {
    phase: "الساعات الأولى – الاحتواء",
    brief:
      "تعطل مفاجئ في خدمات حيوية. لا يوجد تأكيد رسمي. منصات رقمية تنشر روايات متضاربة عن “هجوم إرهابي سيبراني”. المطلوب: إدارة الفراغ المعلوماتي وتوحيد القرار.",
    decisions: [
      {
        text: "إصدار بيان رسمي سريع",
        result:
          "البيان هدّأ جزءًا من الذعر، لكنه قلّل مساحة المناورة مع نقص المعلومات.",
        delta: { security: +2, trust: +8, continuity: +1, pressure: -2 }
      },
      {
        text: "إدارة صامتة مؤقتة",
        result:
          "تحسّن جمع المعلومات داخليًا، لكن الفراغ الإعلامي زاد الشائعات.",
        delta: { security: +6, trust: -8, continuity: +1, pressure: +6 }
      },
      {
        text: "تشكيل غرفة عمليات مشتركة",
        result:
          "تحسّن التنسيق ورسالة الدولة بدأت تتماسك، مع ضبط أولويات الاستجابة.",
        delta: { security: +8, trust: +3, continuity: +4, pressure: -1 }
      }
    ]
  },
  {
    phase: "72 ساعة – موجة التضليل",
    brief:
      "تزايد محتوى مضلل وفيديوهات مفبركة تربط الأزمة بجهات متطرفة. الإعلام الخارجي يضخّم الرواية. الخدمات تتحسن جزئيًا لكن السردية سلبية.",
    decisions: [
      {
        text: "مواجهة تضليل منظمة برسائل موحدة",
        result:
          "تفنيد منضبط قلّل مساحة الشائعات، لكنه رفع سقف التوقعات على الدولة.",
        delta: { security: +4, trust: +7, continuity: +1, pressure: -3 }
      },
      {
        text: "إجراءات ضبط رقمية واسعة مؤقتًا",
        result:
          "الضبط خفّض الضجيج مؤقتًا، لكنه فتح باب انتقادات ورفع حساسية الرأي العام.",
        delta: { security: +7, trust: -6, continuity: +2, pressure: +7 }
      },
      {
        text: "التركيز على التشغيل فقط وإهمال السردية",
        result:
          "استعادة الخدمات تقدمت، لكن الخصم كسب رواية الحدث في الوعي العام.",
        delta: { security: +2, trust: -7, continuity: +8, pressure: +6 }
      }
    ]
  },
  {
    phase: "أسبوع – التأطير السياسي",
    brief:
      "الاستقرار الفني شبه كامل، لكن الأسئلة السياسية قائمة: من المسؤول؟ هل الدولة كانت جاهزة؟ هل سنعلن نتائج؟ هناك اهتمام دولي بالتعاون.",
    decisions: [
      {
        text: "تدويل منضبط وتعاون محدود انتقائي",
        result:
          "التعاون حسن الصورة خارجيًا، لكنه احتاج إدارة سيادية دقيقة للمعلومات.",
        delta: { security: +3, trust: +3, continuity: +0, pressure: -4 }
      },
      {
        text: "معالجة داخلية كاملة ورفض أطر خارجية",
        result:
          "سيادة القرار زادت، لكن الضغط الخارجي والاستفهامات الإعلامية ارتفعت.",
        delta: { security: +5, trust: -1, continuity: +0, pressure: +5 }
      },
      {
        text: "إعلان خطة إصلاحات وحوكمة رقمية",
        result:
          "التركيز على المستقبل هدّأ الجدل جزئيًا ورفع الثقة، مع التزام سياسي.",
        delta: { security: +2, trust: +8, continuity: +1, pressure: -2 }
      }
    ]
  }
];

// ====== State ======
const state = {
  kpi: { security: 60, trust: 55, continuity: 58, pressure: 50 },
  roundIndex: 0,
  picked: null,
  history: []
};

// ====== Helpers ======
const clamp = (n) => Math.max(0, Math.min(100, n));

function applyDelta(delta) {
  for (const key of Object.keys(delta)) {
    state.kpi[key] = clamp(state.kpi[key] + delta[key]);
  }
}

function updateKpisUI() {
  document.getElementById("kpi-security").innerText = state.kpi.security;
  document.getElementById("kpi-trust").innerText = state.kpi.trust;
  document.getElementById("kpi-continuity").innerText = state.kpi.continuity;
  document.getElementById("kpi-pressure").innerText = state.kpi.pressure;
}

function renderRound() {
  const r = rounds[state.roundIndex];
  document.getElementById("phase").innerText = r.phase;
  document.getElementById("brief").innerText = r.brief;

  const choices = document.getElementById("choices");
  choices.innerHTML = "";

  state.picked = null;
  const feedback = document.getElementById("feedback");
  feedback.innerText = "اختر قرارًا لعرض النتيجة.";

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;

  r.decisions.forEach((d, idx) => {
    const btn = document.createElement("button");
    btn.innerText = d.text;
    btn.onclick = () => pickDecision(idx);
    choices.appendChild(btn);
  });

  updateKpisUI();
}

function pickDecision(idx) {
  const r = rounds[state.roundIndex];
  const d = r.decisions[idx];

  // Prevent double-pick
  if (state.picked !== null) return;

  state.picked = idx;
  applyDelta(d.delta);

  state.history.push({
    phase: r.phase,
    decision: d.text,
    result: d.result,
    delta: d.delta,
    kpiAfter: { ...state.kpi }
  });

  document.getElementById("feedback").innerText =
    `${d.result}\n\n(الأثر: السيطرة ${fmt(d.delta.security)} | الثقة ${fmt(d.delta.trust)} | الاستمرارية ${fmt(d.delta.continuity)} | الضغط ${fmt(d.delta.pressure)})`;

  updateKpisUI();
  document.getElementById("nextBtn").disabled = false;
}

function fmt(n) {
  return (n >= 0 ? "+" : "") + n;
}

function showReport() {
  document.getElementById("scenario").classList.add("hidden");
  document.getElementById("decisions").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("kpis").classList.add("hidden");

  const rep = document.getElementById("report");
  rep.classList.remove("hidden");

  // Build report
  const { security, trust, continuity, pressure } = state.kpi;
  const best = Object.entries(state.kpi).sort((a,b) => b[1]-a[1])[0];
  const worst = Object.entries(state.kpi).sort((a,b) => a[1]-b[1])[0];

  const label = (k) => ({
    security: "السيطرة الأمنية",
    trust: "ثقة الرأي العام",
    continuity: "استمرارية المرافق",
    pressure: "الضغط السياسي"
  }[k]);

  const lines = state.history.map((h, i) => {
    return `<li><b>مرحلة ${i+1}:</b> ${h.phase}<br/>
    <b>القرار:</b> ${h.decision}<br/>
    <b>النتيجة:</b> ${h.result}</li>`;
  }).join("");

  // Training note (simple rules)
  let note = "أداء متوازن.";
  if (pressure >= 70 && trust <= 45) note = "الضغط السياسي مرتفع مع تراجع الثقة—راجع سياسات التواصل وتهدئة السردية.";
  else if (continuity <= 45) note = "استمرارية المرافق ضعيفة—راجع أولويات التشغيل والتنسيق مع الجهات الخدمية.";
  else if (security <= 45) note = "السيطرة الأمنية منخفضة—راجع مسارات التنسيق واتخاذ القرار المبكر.";
  else if (trust >= 70 && pressure <= 45) note = "إدارة سردية قوية مع ضغط منخفض—مسار تدريبي جيد.";

  document.getElementById("reportBody").innerHTML = `
    <p><b>النتيجة النهائية:</b></p>
    <ul>
      <li>السيطرة الأمنية: <b>${security}</b></li>
      <li>ثقة الرأي العام: <b>${trust}</b></li>
      <li>استمرارية المرافق: <b>${continuity}</b></li>
      <li>الضغط السياسي: <b>${pressure}</b></li>
    </ul>

    <p><b>أعلى مؤشر:</b> ${label(best[0])} (${best[1]})</p>
    <p><b>أقل مؤشر:</b> ${label(worst[0])} (${worst[1]})</p>

    <p><b>ملخص المسار:</b></p>
    <ol>${lines}</ol>

    <p><b>ملاحظة تدريبية:</b> ${note}</p>
  `;
}

function restart() {
  state.kpi = { security: 60, trust: 55, continuity: 58, pressure: 50 };
  state.roundIndex = 0;
  state.picked = null;
  state.history = [];

  document.getElementById("scenario").classList.remove("hidden");
  document.getElementById("decisions").classList.remove("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("kpis").classList.remove("hidden");
  document.getElementById("report").classList.add("hidden");

  renderRound();
}

// ====== Events ======
document.getElementById("nextBtn").onclick = () => {
  if (state.roundIndex < rounds.length - 1) {
    state.roundIndex += 1;
    renderRound();
  } else {
    showReport();
  }
};

document.getElementById("restartBtn").onclick = restart;
document.getElementById("restartBtn2").onclick = restart;

// ====== Init ======
renderRound();
