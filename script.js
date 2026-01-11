const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const soundBtn = document.getElementById("sound-btn");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");
const message = document.getElementById("message");
const wordText = document.getElementById("word");
const phoneticText = document.getElementById("phonetic");
const meaningsContainer = document.getElementById("meanings-container");

let audioUrl = "";

btn.addEventListener("click", () => {
    let word = inpWord.value.trim();
    if (word) getWord(word);
});

inpWord.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        let word = inpWord.value.trim();
        if (word) getWord(word);
    }
});

function getWord(word) {
    result.classList.add("hidden");
    message.classList.remove("hidden");
    message.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-2xl"></i><p class="mt-2 text-white/80">Searching...</p>`;
    
    fetch(url + word)
        .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then((data) => {
            displayResult(data[0]);
        })
        .catch(() => {
            showError("Word not found.");
        });
}

function displayResult(data) {
    message.classList.add("hidden");
    result.classList.remove("hidden");

    wordText.textContent = data.word;
    const phonetic = data.phonetic || (data.phonetics.find(p => p.text)?.text || "");
    phoneticText.textContent = phonetic;

    audioUrl = "";
    const audioObj = data.phonetics.find(p => p.audio !== "");
    if (audioObj) {
        audioUrl = audioObj.audio;
        soundBtn.classList.remove("hidden");
    } else {
        soundBtn.classList.add("hidden");
    }

    meaningsContainer.innerHTML = "";
    
    if (data.meanings && data.meanings.length > 0) {
        const entry = data.meanings[0];
        const partOfSpeech = entry.partOfSpeech || "N/A";
        const defObj = entry.definitions?.[0];
        
        if (defObj) {
            meaningsContainer.innerHTML = `
                <div class="bg-white/10 p-4 rounded-xl border border-white/20">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="font-bold italic text-white/90 text-lg">${partOfSpeech}</span>
                        <div class="h-[1px] bg-white/20 flex-grow"></div>
                    </div>
                    
                    <div class="mb-4">
                        <h3 class="text-white font-medium mb-1">Meaning</h3>
                        <p class="text-white/80 text-base leading-relaxed">${defObj.definition}</p>
                    </div>

                    ${defObj.example ? `
                    <div>
                        <h3 class="text-white font-medium mb-1">Example</h3>
                        <p class="text-white/70 italic border-l-2 border-white/50 pl-3">${defObj.example}</p>
                    </div>` : ''}
                </div>
            `;
        }
    }
}

function showError(msg) {
    result.classList.add("hidden");
    message.classList.remove("hidden");
    message.innerHTML = `<span class="bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">${msg}</span>`;
}

soundBtn.addEventListener("click", () => {
    if (audioUrl) {
        new Audio(audioUrl).play();
    }
});