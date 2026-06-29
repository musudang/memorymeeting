import { useState } from 'react'
import './App.css'
import ApplyForm from './components/ApplyForm'
import SuccessModal from './components/SuccessModal'

const MEETUP_DATE = '2026년 7월 19일 (토) 오후 2시'
const MEETUP_LOCATION = '강남구 일대 (신청 완료 후 상세 장소 안내)'
const DEPOSIT_AMOUNT = '10,000원'
const BANK_INFO = '토스뱅크 1002-5100-7919 (예금주: 이승훈)'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [successData, setSuccessData] = useState(null)

  return (
    <div className="landing">

      {/* 헤더 */}
      <header className="header">
        <div className="logo">MEMORY</div>
        <button className="header-cta" onClick={() => setShowForm(true)}>신청하기</button>
      </header>

      {/* 히어로 */}
      <section className="hero">
        <p className="hero-eyebrow">40 · 50대 소규모 오프라인 모임</p>
        <h1 className="hero-title">
          오늘,<br/>함께 만나볼까요?
        </h1>
        <p className="hero-sub">
          비슷한 나이, 비슷한 이야기.<br/>
          2대2 · 3대3으로 편하게 만나보세요.
        </p>
        <button className="cta-btn" onClick={() => setShowForm(true)}>
          무료 신청하기
        </button>
        <p className="hero-note">보증금 {DEPOSIT_AMOUNT} · 모임 당일 100% 환급</p>
      </section>

      {/* 신뢰 지표 */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-num">100%</span>
            <span className="trust-label">보증금 환급</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-num">실명</span>
            <span className="trust-label">신원 확인</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-num">소규모</span>
            <span className="trust-label">2~3명씩</span>
          </div>
        </div>
      </section>

      {/* 공감 섹션 */}
      <section className="empathy-section">
        <p className="section-eyebrow">이런 분들께</p>
        <h2 className="section-title">혼자 보내는 주말,<br/>이제 바꿔보세요</h2>
        <div className="empathy-list">
          {[
            '새로운 친구를 사귀고 싶은데 어디서 시작해야 할지 모르겠어요',
            '취미는 있는데 같이 즐길 사람이 없어요',
            '나이 들었지만 새로운 인연도 기대하고 싶어요',
            '자녀들도 바쁘고, 내 이야기를 들어줄 친구가 그리워요',
          ].map((text, i) => (
            <div key={i} className="empathy-item">
              <span className="empathy-check">✓</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 진행 방법 */}
      <section className="how-section">
        <p className="section-eyebrow">진행 방법</p>
        <h2 className="section-title">3단계로 끝나요</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <h3>신청서 작성</h3>
              <p>이름, 나이, 취미 등 간단한 정보와 보증금 {DEPOSIT_AMOUNT}을 입금해주세요.</p>
            </div>
          </div>
          <div className="step-line" />
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <h3>매칭 안내</h3>
              <p>모임 3일 전, 카카오톡으로 장소와 함께할 분들 정보를 안내드려요.</p>
            </div>
          </div>
          <div className="step-line" />
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <h3>오프라인 만남</h3>
              <p>카페에서 편하게 2시간 대화를 나눠요. 참석하시면 보증금을 바로 돌려드려요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 다음 모임 */}
      <section className="schedule-section">
        <p className="section-eyebrow">다음 모임</p>
        <h2 className="section-title">7월 첫 번째 모임</h2>
        <div className="schedule-card">
          <div className="schedule-row">
            <span className="schedule-key">일시</span>
            <span className="schedule-val">{MEETUP_DATE}</span>
          </div>
          <div className="schedule-row">
            <span className="schedule-key">장소</span>
            <span className="schedule-val">{MEETUP_LOCATION}</span>
          </div>
          <div className="schedule-row">
            <span className="schedule-key">형태</span>
            <span className="schedule-val">2대2 · 3대3 소그룹</span>
          </div>
          <div className="schedule-row">
            <span className="schedule-key">인원</span>
            <span className="schedule-val">최대 12명 <span className="badge-red">잔여 8석</span></span>
          </div>
          <button className="cta-btn dark" onClick={() => setShowForm(true)}>
            이 모임 신청하기
          </button>
        </div>
      </section>

      {/* 안심 섹션 */}
      <section className="safety-section">
        <p className="section-eyebrow">안심하세요</p>
        <h2 className="section-title">안전하게 만날 수 있어요</h2>
        <div className="safety-list">
          {[
            { title: '실명 · 연락처 확인', desc: '모든 참가자는 이름과 전화번호를 확인해요.' },
            { title: '공공장소 카페', desc: '번화가의 밝고 쾌적한 카페에서만 진행해요.' },
            { title: '소규모 그룹', desc: '2~3명씩 소그룹이라 훨씬 편하게 대화할 수 있어요.' },
            { title: '보증금 현장 환급', desc: '참석하시면 당일 현장에서 바로 돌려드려요.' },
          ].map((item, i) => (
            <div key={i} className="safety-item">
              <div className="safety-dot" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bottom-cta">
        <h2>지금 신청하세요</h2>
        <p>소규모 모집이라 자리가 금방 마감돼요</p>
        <button className="cta-btn" onClick={() => setShowForm(true)}>
          무료 신청하기
        </button>
        <p className="hero-note" style={{marginTop: '12px'}}>보증금 {DEPOSIT_AMOUNT} · 모임 당일 100% 환급</p>
      </section>

      <footer className="footer">
        <p className="logo" style={{marginBottom:'8px'}}>MEMORY</p>
        <p>오늘, 함께 만나볼까요?</p>
        <p style={{marginTop:'12px', opacity:0.4}}>문의: 카카오톡 채널 @MEMORY</p>
      </footer>

      {showForm && (
        <ApplyForm
          onClose={() => setShowForm(false)}
          onSuccess={(data) => { setShowForm(false); setSuccessData(data) }}
          depositAmount={DEPOSIT_AMOUNT}
          bankInfo={BANK_INFO}
        />
      )}

      {successData && (
        <SuccessModal
          data={successData}
          bankInfo={BANK_INFO}
          depositAmount={DEPOSIT_AMOUNT}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  )
}

export default App
