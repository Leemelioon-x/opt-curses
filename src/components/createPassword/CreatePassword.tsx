import React, {ChangeEvent, useState} from 'react';
import classes from "./CreatePassword.module.css";
import SuperInputText from "../c1-SuperInputText/SuperInputText";
import SuperButton from "../c2-SuperButton/SuperButton";
import SuperCheckbox from "../c3-SuperCheckbox/SuperCheckbox";
import {passwordDB} from "../../redux/passwordDB";

const CreatePassword = () => {
    const [visibleGeneratedPassword, setVisibleGeneratedPassword] = useState<boolean>(false)
    const [visiblePasswordSecurityAssessments, setVisiblePasswordSecurityAssessments] = useState<boolean>(false)
    const [visibleSettingsGeneratedPassword, setVisibleSettingsGeneratedPassword] = useState<boolean>(false)
    const [visibleSettingsSecurityAssessmentsPassword, setVisibleSettingsSecurityAssessmentsPassword] = useState<boolean>(false)
    const [generatedPassword, setGeneratedPassword] = useState<string>("sadEdss32@RK")
    const [securityAssessmentsPassword, setSecurityAssessmentsPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [checkPassword, setCheckPassword] = useState<string>("")
    const [caseSensitiveDictionaryPasswordVerification, setCaseSensitiveDictionaryPasswordVerification] = useState<boolean>(false)
    const [CaseInsensitiveDictionaryPasswordVerification, setCaseInsensitiveDictionaryPasswordVerification] = useState<boolean>(true)

    const visibleDiv = (visibleValue: boolean, setVisible: (value: boolean) => void): void => {
        setVisible(!visibleValue)
    }

    const generatePassword = () => {
        setVisibleGeneratedPassword(true)
    }

    const dictionaryCheck=(e:boolean, setValue:(value:boolean)=>void )=>{
        setValue(e)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckPassword(e.currentTarget.value)

    }
    const onClickHandler=()=> {
        if (caseSensitiveDictionaryPasswordVerification) {
            passwordDB.map(el => el.toLowerCase() === checkPassword.toLowerCase() ? (setSecurityAssessmentsPassword(`Very Weak - так как ${checkPassword} находится в словаре слабых паролей`), setVisiblePasswordSecurityAssessments(true)) : el)
        }
        if (CaseInsensitiveDictionaryPasswordVerification) {
            passwordDB.map(el => el === checkPassword ? (setSecurityAssessmentsPassword(`Very Weak - так как ${checkPassword} находится в словаре слабых паролей`), setVisiblePasswordSecurityAssessments(true)) : el)
        }
    }

    function chkPasswordStrength(checkPassword: string, strenghtMsg: string, errorMsg: string) {
        let desc = new Array();
        desc[0] = "Very Weak";
        desc[1] = "Weak";
        desc[2] = "Better";
        desc[3] = "Medium";
        desc[4] = "Strong";
        desc[5] = "Strongest";

        errorMsg = ''
        let score = 0;

        //if txtpass bigger than 6 give 1 point
        if (checkPassword.length >= 8) score++;

        //if txtpass has both lower and uppercase characters give 1 point
        if ((checkPassword.match(/[a-z]/)) && (checkPassword.match(/[A-Z]/))) score++;

        //if txtpass has at least one number give 1 point
        if (checkPassword.match(/\d+/)) score++;

        //if txtpass has at least one special caracther give 1 point
        if (checkPassword.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) score++;

        //if txtpass bigger than 12 give another 1 point
        if (checkPassword.length > 12) score++;


        strenghtMsg = desc[score];


        if (checkPassword.length < 8) {
            errorMsg = "Password Should be Minimum 8 Characters"

        }

        setSecurityAssessmentsPassword(strenghtMsg)
        setErrorMessage(errorMsg)
        setVisiblePasswordSecurityAssessments(true)
    }


    return (
        <div className={classes.create_password_container}>
            <div className={classes.create_password_title}>Приложение по созданию и проверке пароля на его надёжность
            </div>
            <div className={classes.checking_password_for_reliability_container}>
                <div className={classes.input_checking_password}>
                    <SuperInputText onChange={(e) => onChangeHandler(e)} value={checkPassword}/>
                    <SuperButton
                        onClick={() => visibleDiv(visibleSettingsSecurityAssessmentsPassword, setVisibleSettingsSecurityAssessmentsPassword)}>Расширенные
                        настройки проверки пароля</SuperButton>
                    {visibleSettingsSecurityAssessmentsPassword ?
                        <div>
                            Проверка по словарю:
                            <div>
                                <div><SuperCheckbox >поиск полного совпадения со строками словаря без учета
                                    регистра</SuperCheckbox></div>
                                <div><SuperCheckbox>поиск полного совпадения со строками словаря с учетом
                                    регистра </SuperCheckbox></div>
                            </div>
                        </div>
                        :
                        <></>
                    }

                    <SuperButton
                        onClick={()=> chkPasswordStrength(checkPassword, securityAssessmentsPassword, errorMessage)}>Проверить
                        на надежность</SuperButton>
                    <SuperButton onClick={onClickHandler}>Проверить имеется ли ваш пароль с слове слабых паролей</SuperButton>
                    {visiblePasswordSecurityAssessments ?
                        <div>
                            {errorMessage === "Password Should be Minimum 8 Characters" ?
                                <div>Ваша длина пароля меньше 8 символов</div>
                                :
                                <div>Ваша надежность соответствует уровню: {securityAssessmentsPassword}</div>
                            }
                        </div>
                        :
                        <></>
                    }
                </div>
            </div>
            <div>
                <div className={classes.settings_password_generation_container}>
                    <SuperButton
                        onClick={() => visibleDiv(visibleSettingsGeneratedPassword, setVisibleSettingsGeneratedPassword)}>Настройки
                        по созданию пароля</SuperButton>
                    {visibleSettingsGeneratedPassword ?
                        <div>
                            Настройки генерации пароля
                            <div>
                                <div>В состав пароля войдут:</div>
                                <SuperCheckbox>Числа</SuperCheckbox>
                                <SuperCheckbox>Спецсимволы</SuperCheckbox>
                                <SuperCheckbox>Символы с Верхним регистром</SuperCheckbox>
                            </div>
                            <div>Определите длину пароля(не менее 8 символов):</div>
                            <SuperInputText/>
                        </div>
                        :
                        <></>
                    }
                </div>
                <div className={classes.password_generation_container}>
                    <SuperButton onClick={generatePassword}>Сгенерировать пароль</SuperButton>
                    {visibleGeneratedPassword ?
                        <div>Ваш сгенерированный пароль: {generatedPassword}</div>
                        :
                        <></>
                    }

                </div>
            </div>
        </div>
    );
};

export default CreatePassword;