document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.quiz-body__form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');

    const answersObj = {
        step0: {
            question: '',
            answers: []
        },
        step1: {
            question: '',
            answers: []
        },
        step2: {
            question: '',
            answers: []
        },
        step3: {
            question: '',
            answers: []
        },
        step4: {
            name: '',
            phone: '',
            email: '',
            call: ''
        }
    }

    btnsNext.forEach((item, index) => {
        item.addEventListener('click', event => {
            event.preventDefault();

            formItems[index].style.display = 'none';
            formItems[index + 1].style.display = 'block';
        });

        item.disabled = true;
    });

    btnsPrev.forEach((item, index) => {
        item.addEventListener('click', event => {
            event.preventDefault();

            formItems[index + 1].style.display = 'none';
            formItems[index].style.display = 'block';
        });
    });

    formItems.forEach((item, index) => {
        index === 0 ? item.style.display = 'block' : item.style.display = 'none';

        if (index !== formItems.length -1 ) {
            const itemTitle = item.querySelector('.form__title');
            const inputs = form.querySelectorAll('input');

            answersObj[`step${index}`].question = itemTitle.textContent;

            inputs.forEach(input => {
               const parent = input.parentNode;
               input.checked = false;
               parent.classList.remove('active-radio');
               parent.classList.remove('active-checkbox');
            });
        }

        item.addEventListener('change', event => {
            const target = event.target;
            const inputsChecked = item.querySelectorAll('input:checked');

            if (index !== formItems.length -1 ) {

                answersObj[`step${index}`].answers.length = 0;

                inputsChecked.forEach((checkedItem, checkedIndex) => {
                    answersObj[`step${index}`].answers.push(checkedItem.value);
                });

                inputsChecked.length > 0 ? btnsNext[index].disabled = false : btnsNext[index].disabled = true;

                if (target.classList.contains('form__radio')) {
                    const radios = item.querySelectorAll('.form__radio');

                    radios.forEach(input => {
                        input === target ? input.parentNode.classList.add('active-radio') : input.parentNode.classList.remove('active-radio');
                    });
                } else if (target.classList.contains('form__input')) {
                    target.parentNode.classList.toggle('.active-checkbox');
                } else {
                    return;
                }
            }
        });
    });

    const sendForm = () => {
        const lastFieldset = formItems[formItems.length - 1];

        form.addEventListener('submit', event => {
            event.preventDefault();

            answersObj.step4.name = document.getElementById('quiz-name').value;
            answersObj.step4.phone = document.getElementById('quiz-phone').value;
            answersObj.step4.email = document.getElementById('quiz-email').value;
            answersObj.step4.call = document.getElementById('quiz-call').value;

            if (document.getElementById('quiz-policy').checked) {
                postData(answersObj).then(res => {
                    if (res.status === 200) {
                        overlay.style.display = 'none';
                        quiz.style.display = 'none';
                        alert('Успешно отправлено');
                    } else {

                    }
                });
            } else {
                alert('Подтвердите обработку персональных данных');
            }
        });
    }

    const postData = body => {
        return fetch('./server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    };

    overlay.style.display = 'none';
    quiz.style.display = 'none';

    passTestButton.addEventListener('click', event => {
        overlay.style.display = 'block';
        quiz.style.display = 'block';
    });

    sendForm();
});