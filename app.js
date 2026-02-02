
const round = {
  phase: "الساعات الأولى – الاحتواء",
  brief:
    "تعطل مفاجئ في خدمات حيوية. لا يوجد تأكيد رسمي. منصات رقمية تنشر روايات متضاربة عن هجوم إرهابي سيبراني.",
  decisions: [
    {
      text: "إصدار بيان رسمي سريع",
      result:
        "البيان هدّأ الرأي العام نسبيًا، لكنه قيّد هامش المناورة الأمنية في الساعات الأولى."
    },
    {
      text: "إدارة صامتة مؤقتة",
      result:
        "التحقيق الداخلي تحسّن، لكن الفراغ المعلوماتي سمح بانتشار الشائعات."
    },
    {
      text: "تشكيل غرفة عمليات مشتركة",
      result:
        "تحسّن التنسيق المؤسسي وبدأت استعادة السيطرة على السردية."
    }
  ]
};

document.getElementById("phase").innerText = round.phase;
document.getElementById("brief").innerText = round.brief;

const choicesDiv = document.getElementById("choices");
const feedback = document.getElementById("feedback");

round.decisions.forEach(d => {
  const btn = document.createElement("button");
  btn.innerText = d.text;
  btn.onclick = () => {
    feedback.innerText = d.result;
  };
  choicesDiv.appendChild(btn);
});
