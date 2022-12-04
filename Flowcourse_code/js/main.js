
// Список меню
let topHeaderMenu = document.querySelector(".header__top-list");
//Все бургеры
//let burger = document.querySelectorAll(".burger");
//Бургер из меню
let burgerHeader = document.querySelector(".header__top-burger");
let activeBody = document.querySelector("body");
//Навешиваем событие "клик" на бургер
burgerHeader.addEventListener("click", function () {
	topHeaderMenu.classList.toggle("active");
	burgerHeader.classList.toggle("active");
	activeBody.classList.toggle("active-body");
});

function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

$(document).ready(function () {
	$(".sliders__part1").slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 1000,
		rtl: true,
		arrows: false,
		responsive: [
			{
				breakpoint: 1450,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 830,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 680,
				settings: {
					slidesToShow: 1,
				}
			},
		]
	})

})

$(document).ready(function () {
	$(".sliders__part2").slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 1000,
		arrows: false,
		responsive: [
			{
				breakpoint: 1450,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 830,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 680,
				settings: {
					slidesToShow: 1,
				}
			},
		]
	})

})


//<==============ДИНАМИЧЕСКИЙ АДАПТИВ==================
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		//* МОЖНО И ТАК: const data = node.getAttribute("data-da").trim();
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		//! ОРИГИНАЛЬНАЯ СТРОКА: оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.destination = dataArray[0].trim();
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		//+++++++++++++++++++++++++++++++++++++++++++
		//! ОРИГИНАЛЬНАЯ СТРОКА: destination.insertAdjacentElement('beforeend', element);
		document.querySelector(`.${destination}`).insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
//==============ДИНАМИЧЕСКИЙ АДАПТИВ==================>


//==============Выпадающие регистрация и вход==================>
jQuery(document).ready(function ($) {
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$main_nav = $('.main-nav');
	let reg = $('.registration__reg-link');
	let entry = $('.registration__entry-reg');


	//открыть модальное окно
	$main_nav.on('click', function (event) {
		//показать модальный слой
		event.preventDefault()
		$form_modal.addClass('is-visible');
		$(document.body).addClass('active-body');
		//показать выбранную форму
		signup_selected()
	});

	//закрыть модальное окно
	$('.cd-user-modal').on('click', function (event) {
		if ($(event.target).is($form_modal) || $(event.target).is('.cd-close-form')) {
			$form_modal.removeClass('is-visible');
			$(document.body).removeClass('active-body');
		}
	});
	//закрыть модальное окно нажатье клавиши Esc 
	$(document).keyup(function (event) {
		if (event.which == '27') {
			$form_modal.removeClass('is-visible');
			$(document.body).removeClass('active-body');

		}
	});

	//переключения  вкладки от одной к другой
	$form_modal_tab.on('click', function (event) {
		event.preventDefault();
		($(event.target).is($tab_login)) ? login_selected() : signup_selected();
	});

	$(reg).bind('click', function (event) {
		event.preventDefault();
		signup_selected()
	});

	$(entry).bind('click', function (event) {
		event.preventDefault();
		login_selected()
	});

	function login_selected() {
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected() {
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}
});
//==============Выпадающие регистрация и вход==================>

//==============================Изменение цвета header при скролле//==============================
if (document.querySelector(".header__top-main")) {
	var minOffset = 90;

	let header_main = document.querySelector(".header__top-main")
	window.onscroll = function () {
		let has_class = header_main.classList.contains("is_scrolled-mainPage");

		if (minOffset < document.documentElement.scrollTop) {
			if (!has_class) {
				header_main.classList.add("is_scrolled-mainPage");
			}
		} else if (has_class) {
			header_main.classList.remove("is_scrolled-mainPage")

		}
	}

}

if (document.querySelector(".header-teacher__top")) {
	let headerTeacher__top = document.querySelector(".header-teacher__top")
	var minOffset = 90;

	window.onscroll = function () {
		let has_class_teacher = headerTeacher__top.classList.contains("is_scrolled-teacher");


		if (minOffset < document.documentElement.scrollTop) {
			if (!has_class_teacher) {
				headerTeacher__top.classList.add("is_scrolled-teacher");
			}
		} else if (has_class_teacher) {
			headerTeacher__top.classList.remove("is_scrolled-teacher")

		}
	}
}

//==============================Изменение цвета header при скролле//==============================


