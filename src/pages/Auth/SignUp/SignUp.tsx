import Input from '@/components/common/Input/Input';
import styles from './SignUp.module.scss';
import Button from '@/components/common/Button/Button';
import { useEffect, useRef, useState } from 'react';
import memberAPIList from '@/services/member';
import { IRegister } from '@/interfaces/member';
import Timer from '@/components/common/Timer/Timer';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import { useRouter } from '@/hooks/useRouter';
import { validateForm } from '@/utils/validate';
import toast from 'react-hot-toast';
import AgencySelect from '@/components/agencySelect';
import agencyAPIList from '@/services/agency';

const SignUpPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [signUpInfo, setSignUpInfo] = useState<IRegister>({
    name: '',
    tel: '',
    password: '',
    email: '',
    memberRole: 'STUDENT', // select default
    passwordConfirm: '',
    passwordMatch: false,
    parentTel: '',
    agencyId: 0,
  });
  const [isSendAuthCode, setIsSendAuthCode] = useState<boolean>(false);
  const [isLoading, setIsLoadin] = useState(false);
  const [agencyData,setAgencyData] = useState([])
  const [selectedAgency, setSelectedAgency] = useState<{
    id:number;
    name: string;
  }>()
  const router = useRouter();

  /**
   * 하위 3개 state는 timer 관련 state입니다.
   */
  const [durationTime, setDurationTime] = useState(300);
  const [isAuthCodeComplete, setisAuthCodeComplete] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpInfo((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: value,
      };

      return {
        ...updatedState,
        passwordMatch: updatedState.password === updatedState.passwordConfirm,
      };
    });
  };

  const handleClickAuthCode = async () => {
    setIsLoadin(true);
    //만약 재전송인경우 타임을 리셋한다.
    if (!isAuthCodeComplete) {
      setDurationTime(300);
    }
    try {
      const payload = {
        tel: signUpInfo.tel,
      };
      const res = await memberAPIList.memberIdentityCheck(payload);
      if (res) {
        setIsSendAuthCode(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadin(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await memberAPIList.memberRegister(signUpInfo);
      console.log(res);
      if (res) {
        router.push('/main');
      }
    } catch (error) {
      console.log(error);
      toast.error('이미 존재하는 전화번호입니다.');
    }
  };

  const getAgencyList = async () => {
    try {
      const res = await agencyAPIList.getAgencyList();
      setAgencyData(res)
      console.log(res);
      
    } catch (error) {
      
    }
    
  }

  useEffect(() => {
    inputRef.current?.focus();
    getAgencyList()
  }, []);


  useEffect(() => {
    if (selectedAgency) {
      setSignUpInfo((prev) => ({
        ...prev,
        agencyId: selectedAgency?.id,
      }));
    }
  }, [selectedAgency]);
  const isFormValid = validateForm(signUpInfo, isAuthCodeComplete);

  return (
    <div className={styles.SignUpContainer}>
      <Input
        label="이름"
        type="text"
        placeholder="이름을 입력하세요"
        ref={inputRef}
        name="name"
        onChange={handleChange}
      />
      <div>
        <div className={styles.LabelWrap}>전화번호</div>
        <div className={styles.Flex}>
          <input
            type="number"
            placeholder="(-) 제외하고 입력하세요"
            className={styles.WrapInput}
            name="tel"
            onChange={handleChange}
            disabled={isSendAuthCode}
          />
          <Button
            className={styles.WrapButton}
            buttonType={
              isAuthCodeComplete
                ? 'Disabled'
                : signUpInfo.tel?.length > 0
                  ? 'Active'
                  : 'Disabled'
            }
            onClick={handleClickAuthCode}
            isLoading={isLoading}
          >
            {isAuthCodeComplete
              ? '인증완료'
              : isSendAuthCode
                ? '재전송'
                : '인증번호 받기'}
          </Button>
        </div>
      </div>
      {isSendAuthCode && (
        <Timer
          duration={durationTime}
          onComplete={setisAuthCodeComplete}
          isComplete={isAuthCodeComplete}
          isSignUp={true}
        />
      )}

      <Input
        label="비밀번호를 입력하세요"
        name="password"
        type="password"
        placeholder="비밀번호"
        onChange={handleChange}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 확인"
        name="passwordConfirm"
        onChange={handleChange}
      />
      {signUpInfo.passwordConfirm.length > 0 && !signUpInfo.passwordMatch && (
        <div className={styles.PasswordMissMatch}>
          비밀번호가 일치하지 않습니다.
        </div>
      )}
      {signUpInfo.password.length > 0 &&
        signUpInfo.passwordConfirm.length > 0 &&
        signUpInfo.passwordConfirm.length < 6 &&
        signUpInfo.password.length < 6 && (
          <div className={styles.PasswordMissMatch}>
            비밀번호는 6자리 이상 입력해주세요.
          </div>
        )}
      <div className={styles.InputLabel}>기관</div>
      <AgencySelect
        options={agencyData}
        placeholder="기관을 선택해주세요"
        selectedItem={selectedAgency}
        setSelectItem={setSelectedAgency}
      />
      <Input
        label="Email"
        name="email"
        type="text"
        placeholder="Email을 입력하세요"
        onChange={handleChange}
      />
      <div className={styles.FlexCheckBoxWrap}>
        <CheckBox
          checkBoxType={
            signUpInfo.memberRole === 'STUDENT' ? 'Active' : 'Default'
          }
          onClick={() => {
            setSignUpInfo((prev) => ({
              ...prev,
              memberRole: 'STUDENT',
            }));
          }}
        >
          학생
        </CheckBox>
        <CheckBox
          checkBoxType={
            signUpInfo.memberRole === 'TEACHER' ? 'Active' : 'Default'
          }
          // onClick={() => {
          //   setSignUpInfo((prev) => ({
          //     ...prev,
          //     memberRole: 'TEACHER',
          //   }));
          // }}
        >
          선생님
        </CheckBox>
      </div>
      <Input
        label="보호자 전화번호 (선택사항)"
        type="number"
        placeholder="보호자 전화번호를 입력하세요"
        name="parentTel"
        onChange={handleChange}
      />
      <Button
        buttonType={isFormValid ? 'Active' : 'Disabled'}
        className={styles.LoginButton}
        onClick={handleSubmit}
      >
        회원가입
      </Button>
    </div>
  );
};

export default SignUpPage;
