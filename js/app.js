const pexelsApi = "8ftAwey4EUHQsKiyrbxG8zobzVuby6Pv3l084fz6VhDIa0UUdeWDA8rD";
const unsplashApi = "mSoEFUGLNxYk_Dwge2ZfxvEXEYej4CV9VwD7cOi6ywQ";
const pixapayAPI = "49268907-a57813554649e3789c5264c27";
const inputTitle = document.getElementById("input");
const images = document.getElementById("images");
const numOfImages = document.getElementById("numOFImages");
const imagesType = document.getElementById("imagesType");
const history = document.getElementById("history");
const bannedWords = [
  "nude",
  "naked",
  "sex",
  "sexy",
  "porn",
  "erotic",
  "lingerie",
  "hot",
  "sensual",
  "boobs",
  "butt",
  "ass",
  "thighs",
  "breasts",
  "bikini",
  "topless",
  "underwear",
  "panties",
  "fetish",
  "xxx",
  "nsfw",
  "kamasutra",
  "strip",
  "dildo",
  "bdsm",
  "bondage",
  "orgasm",
  "adult",
  "wet",
  "censored",
  "uncensored",
  "camgirl",
  "milf",
  "hentai",
  "deepthroat",
  "hardcore",
  "softcore",
  "pussy",
  "vagina",
  "penis",
  "dick",
  "cock",
  "blowjob",
  "handjob",
  "lesbian",
  "gay",
  "trans",
  "threesome",
  "cum",
  "ejaculate",
  "nipples",
  "nip",
  "arousal",
  "seductive",
  "tempting",
  "provocative",
  "stripper",
  "lapdance",
  "mistress",
  "orgy",
  "exotic",
  "hooker",
  "escort",
  "prostitute",
  "brothel",
  "swinger",
  "sexworker",
  "dominatrix",
  "submission",
  "whip",
  "spanking",
  "slave",
  "anal",
  "bareback",
  "top",
  "bottom",
  "dominant",
  "submissive",
  "kink",
  "fisting",
  "pegging",
  "cumshot",
  "gangbang",
  "creampie",
  "voyeur",
  "masturbate",
  "masturbation",
  "selfpleasure",
  "handcuff",
  "scat",
  "watersports",
  "piss",
  "golden shower",
  "rape",
  "incest",
  "stepmom",
  "stepdad",
  "stepsis",
  "stepbro",
  "daddy",
  "sugar daddy",
  "sugar baby",
  "camshow",
  "onlyfans",
  "feet fetish",
  "footjob",
  "latex",
  "leather",
  "petplay",
  "roleplay",
  "sissy",
  "cuckold",
  "gangrape",
  "facial",
  "double penetration",
  "dp",
  "squirting",
  "rimming",
  "buttplug",
  "docking",
  "furry",
  "tentacle",
  "harem",
  "shemale",
  "ladyboy",
  "futa",
  "dominance",
  "submission",
  "erotic massage",
  "naked yoga",
  "twerking",
  "nudes",
  "deepfake",
  "camsex",
  "live sex",
  "sex tape",
];
let historyArray = JSON.parse(localStorage.getItem("promptsHistory")) || [];
if (!Array.isArray(historyArray)) historyArray = [];
const clearHistoryBtn = document.getElementById("clearHistory");

if (historyArray.length > 0) {
  clearHistoryBtn.classList.remove("disabled");
} else {
  clearHistoryBtn.classList.add("disabled");
}
clearHistoryBtn.addEventListener("click", () => {
  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "لن تتمكن من التراجع بعد هذه الخطوة!",
    icon: "warning",
    showCancelButton: true, // إظهار زر الإلغاء
    confirmButtonColor: "#3085d6", // لون زر التأكيد
    cancelButtonColor: "#d33", // لون زر الإلغاء
    confirmButtonText: "نعم، واصل!",
    cancelButtonText: "لا، إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("promptsHistory");
      historyArray = [];
      history.querySelector(".past-prompts").innerHTML = "";
      Swal.fire("تم التأكيد!", "تم تنفيذ العملية بنجاح.", "success");
    }
  });
});
function resetPrompts() {
  images.innerHTML = "";
  Array(1, 2, 3).map(() => {
    const div = document.createElement("div");
    div.classList.add("image-box");
    images.append(div);
  });
  inputTitle.value = "";
  imagesType.value = "";
  numOfImages.value = "";
}
function addLoading() {
  images.querySelectorAll(".image-box").forEach((box) => {
    box.classList.add("loading");
  });
}
function removeLoading() {
  images.querySelectorAll(".image-box").forEach((box) => {
    box.classList.remove("loading");
  });
}
function validateForm() {
  const error = {
    errorsList: [],
    isFormValid: true,
  };
  if (inputTitle.value === "") {
    error.errorsList.push("يرجى ادخال وصف البحث");
  }
  if (numOfImages.value === "") {
    error.errorsList.push("يرجى اختيار عدد الصور المطلوبة");
  }
  if (imagesType.value === "") {
    error.errorsList.push("يرجى اختيار نوع الصور المطلوبة");
  }
  if (error.errorsList.length > 0) {
    error.isFormValid = false;
  }
  return error;
}
// const translateText = async (text) => {
//   try {
//     const res = await fetch("https://libretranslate.com/translate", {
//       method: "POST",
//       body: JSON.stringify({
//         q: text,
//         source: "auto",
//         target: "en",
//         format: "text",
//         alternatives: 3,
//         api_key: "",
//       }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await res.json();
//     console.log(data);
//     return data.translatedText || "";
//   } catch (error) {
//     console.error("Translation Error:", error);
//     return text;
//   }
// };

const showHistory = () => {
  const history_container = history.querySelector(".past-prompts");
  history_container.innerHTML = "";
  if (historyArray.length === 0) {
    const p = document.createElement("p");
    p.textContent = "فش سجل بحث حتى الان";
    p.style.color = "var(--primary-color)";
    history_container.append(p);
  } else {
    historyArray.forEach((prompt) => {
      const div = document.createElement("div");
      div.classList.add("prompt-item");
      history_container.append(div);

      const i = document.createElement("i");
      i.classList.add("fa-solid", "fa-keyboard");
      div.append(i);

      const p = document.createElement("p");
      p.textContent = prompt.title;
      div.append(p);
      p.addEventListener("click", () => {
        inputTitle.value = prompt.title;
        history.classList.remove("active");
      });
      const span = document.createElement("span");
      span.classList.add("prompt-date");
      span.textContent = new Date(prompt.data).toLocaleString();
      div.append(span);

      const deleteBtn = document.createElement("i");
      deleteBtn.classList.add("fa-solid", "fa-trash");
      div.append(deleteBtn);

      deleteBtn.addEventListener("click", async () => {
        const confirmation = await Swal.fire({
          title: "هل انت متاكد من الحذف ؟",
          text: "لن تتمكن من استرجاع البيانات بعد الحذف",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "موشي",
          cancelButtonText: "الغاء",
        });
        if (confirmation.isConfirmed) {
          historyArray = historyArray.filter((item) => item.id !== prompt.id);
          localStorage.setItem("promptsHistory", JSON.stringify(historyArray));
          showHistory();
        }
      });
    });
  }
};
const noResultAlert = () => {
  Swal.fire({
    title: "لا يوجد نتائج",
    html: `
      <ul style="text-align: right; direction: rtl; list-style-type: disc;">
        <li><strong>قد يكون السبب أحد الأسباب التالية:</strong></li>
        <ul style="color:#fd79a8;">
          <li>الوصف الذي أدخلته غير صالح</li>
          <li>نوع الصور الذي اخترته لا يحتوي على الوصف الذي أدخلته</li>
        </ul>
        <br/>
        <li><strong>ما الذي يمكن فعله؟</strong></li>
        <ul style="color:#6c5ce7;">
          <li>جرب اختيار نوع آخر من الصور</li>
          <li>جرب كتابة وصف آخر</li>
        </ul>
      </ul>
    `,
    icon: "error",
    confirmButtonText: "موشي",
  });
};
const pixapayCode = async (type) => {
  addLoading();
  let query;
  const randomPage = Math.floor(Math.random() * 10) + 1;
  if (type === "black") {
    query = `https://pixabay.com/api/?key=${pixapayAPI}&q=${encodeURIComponent(
      inputTitle.value
    )}&colors=${type}&per_page=${
      numOfImages.value || 1
    }&page=${randomPage}&safesearch=true`;
  } else {
    query = `https://pixabay.com/api/?key=${pixapayAPI}&q=${encodeURIComponent(
      inputTitle.value
    )}&image_type=${type}&per_page=${
      numOfImages.value || 1
    }&page=${randomPage}&safesearch=true`;
  }
  const res = await fetch(query);
  const data = await res.json();
  if (!data.hits || data.hits.length === 0) {
    noResultAlert();
    removeLoading();
    resetPrompts();
  } else {
    images.innerHTML = "";
    data.hits.forEach((photo) => {
      const div = document.createElement("div");
      div.classList.add("image-box");
      images.append(div);
      const img = document.createElement("img");
      div.append(img);
      img.src = photo.largeImageURL;
    });
  }
};
const checkForBannedWords = (query) => {
  return bannedWords.some((word) =>
    query.toLowerCase().includes(word.toLocaleLowerCase())
  );
};
const getImages = async () => {
  try {
    const error = validateForm();
    if (!error.isFormValid) {
      Swal.fire({
        title: "لا يمكن ترك الحقول فارغة",
        html: `<ul style="text-align: right; direction: rtl; list-style: disc; padding-right: 20px;">
        ${error.errorsList
          .map((err) => `<li style="color:red;">${err}</li>`)
          .join("")}
      </ul>`,
        icon: "warning",
        confirmButtonText: "موشي",
      });
      return;
    }

    // بعد التاكد من صحة الفورم يتم اضافة وصف البحث الى سجل البحث
    const exist = historyArray.some((item) => item.title === inputTitle.value);
    if (!exist) {
      historyArray.push({
        id: new Date().getTime(),
        title: inputTitle.value,
        data: new Date(),
      });
      localStorage.setItem("promptsHistory", JSON.stringify(historyArray));
      showHistory();
    }
    if (checkForBannedWords(inputTitle.value)) {
      Swal.fire({
        title: "تم اكتشاف كلمات محظورة في البحث !!",
        text: "بعض الكلمات التي ادخلتها محظورة وقد تعرض محتوى حساس او غير لائق , يرجى العلم انه اذا كررت البحث بكلمات غير لائقة سيتم حظرك من استخدام الموقع",
        icon: "error",
        confirmButtonText: "حسنا , اعد بعدم تكرارها",
      });
      return;
    }
    //  هس هون بجيب البيانات من السيرفر المطلوب حسب اختيار المستخدم
    if (imagesType.value === "Ai") {
      Swal.fire({
        title: "service not availabe!",
        text: "خاصية انشاء الصور بالذكاء الاصطناعي غير متاحة حاليا لضعف الميزانية :(",
        icon: "info",
        confirmButtonText: "موشي",
      });
      return;
    } else if (imagesType.value === "pexels") {
      addLoading();
      const type = "vector";
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${inputTitle.value}&per_page=${
          numOfImages.value || 1
        }&image_type=${type}`,
        {
          headers: { Authorization: pexelsApi },
        }
      );
      const data = await response.json();
      if (data.total_results === 0) {
        noResultAlert();
        removeLoading();
        resetPrompts();
      } else {
        images.innerHTML = "";
        data.photos.forEach((photo) => {
          const div = document.createElement("div");
          div.classList.add("image-box");
          images.append(div);
          const img = document.createElement("img");
          div.append(img);
          img.src = photo.src.medium;
        });
      }
    } else if (imagesType.value === "unsplash") {
      addLoading();
      const res = await fetch(
        `https://api.unsplash.com/photos/random?client_id=${unsplashApi}&query=${inputTitle.value}&count=${numOfImages.value}&content_filter=high`
      );
      const data = await res.json();
      if (data.length === 0 || !Array.isArray(data)) {
        noResultAlert();
        removeLoading();
        resetPrompts();
      } else {
        images.innerHTML = "";
        data.forEach((photo) => {
          const div = document.createElement("div");
          div.classList.add("image-box");
          images.append(div);
          const img = document.createElement("img");
          div.append(img);
          img.src = photo.urls.full;
        });
      }
    } else if (imagesType.value === "pixapay") {
      pixapayCode("photo");
    } else if (imagesType.value === "illustration") {
      pixapayCode("illustration");
    } else if (imagesType.value === "vector") {
      pixapayCode("vector");
    } else if (imagesType.value === "dark") {
      pixapayCode("black");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
document.addEventListener("DOMContentLoaded", function () {
  const historyBtn = document.getElementById("historyBtn");
  historyBtn.addEventListener("click", () =>
    history.classList.toggle("active")
  );

  document.addEventListener("click", (e) => {
    if (!history.contains(e.target) && e.target !== historyBtn) {
      history.classList.remove("active");
    }
  });
});
showHistory();
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
      title: "⚠️ انتباه",
      text: "عمليات البحث في الموقع تعمل فقط باللغة الإنجليزية حاليًا لعدم توفر سيرفرات ترجمة",
      icon: "info",
      confirmButtonText: "فهمت 👍",
      allowOutsideClick: false,
    });
  });
})();
