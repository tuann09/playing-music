const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playlist = $(".playlist");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "APT",
            singer: "ROSÉ",
            path: "./music/apt.m4a",
            image: "https://cdn.tuoitre.vn/zoom/700_700/471584752817336320/2024/10/20/bzvn-rose-apt-han-quoc-5-1729357915807382468320-49-0-573-1000-crop-1729358056612332862169.jpg",
        },
        {
            name: "Flowers",
            singer: "Miley Cyrus",
            path: "./music/flowers.m4a",
            image: "https://i1.sndcdn.com/artworks-YOSTbh90ESawTlzu-s9fROg-t500x500.jpg",
        },
        {
            name: "Supernova",
            singer: "aespa",
            path: "./music/supernova.m4a",
            image: "https://i.scdn.co/image/ab67616d0000b273d2ab7b4a8d0adf91b2167543",
        },
        {
            name: "How Sweet",
            singer: "NewJean",
            path: "./music/howsweet.m4a",
            image: "https://upload.wikimedia.org/wikipedia/en/c/c8/NewJeans_-_How_Sweet.png",
        },
        {
            name: "Daylight",
            singer: "Taylor Swift",
            path: "./music/daylight.m4a",
            image: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
        },
        {
            name: "Start Boy",
            singer: "The Weekend",
            path: "./music/startboy.m4a",
            image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
        },
        {
            name: "Cruel Summer",
            singer: "Taylor Swift",
            path: "./music/cruelsummer.m4a",
            image: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
        },

        {
            name: "Die for you ",
            singer: "The Weekend",
            path: "./music/dieforyou.m4a",
            image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //Xu li  CD quay / dung
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ cd
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        //xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        //Khi song đươcj play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        //Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        //Xu li khi tua song
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        //Khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render;
            _this.scrollToActiveSong();
        };
        //Xu li random bat tat song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        //Xu li lap lai bai hat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        //Xu li next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        //Lang nghe hanh vi click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                //Xu li khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurentSong();
                    _this.render();
                    audio.play();
                }
                //Xu li khi click vao song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },

    loadCurentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    //Khi next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurentSong();
    },
    //Khi prev song
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurentSong();
    },
    start: function () {
        //Định nghĩa các thuộc tính cho Oject
        this.defineProperties();
        //Lắng nghe / xử lý các sự kiện(Dom events)
        this.handleEvents();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurentSong();
        //Render playlist
        this.render();
    },
};
app.start();
