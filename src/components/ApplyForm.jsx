import { useState } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'

const JOBS = ['직장인', '자영업자', '프리랜서', '공무원·교직', '전업주부', '은퇴·무직', '기타']

export default function ApplyForm({ onClose, onSuccess, depositAmount, bankInfo }) {
  const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '', job: '', hobbies: '', groupType: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const validate = () => {
    if (!form.name.trim()) return '이름을 입력해주세요.'
    if (!form.age || form.age < 35 || form.age > 60) return '40~55세만 신청 가능합니다.'
    if (!form.gender) return '성별을 선택해주세요.'
    if (!/^01[0-9]{8,9}$/.test(form.phone.replace(/-/g, ''))) return '올바른 전화번호를 입력해주세요.'
    if (!form.job) return '직업을 선택해주세요.'
    if (!form.hobbies.trim()) return '취미를 입력해주세요.'
    if (!form.groupType) return '모임 형태를 선택해주세요.'
    if (!agreed) return '개인정보 수집에 동의해주세요.'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError('')

    try {
      const phone = form.phone.replace(/-/g, '')

      // 중복 체크
      const q = query(collection(db, 'applications'), where('phone', '==', phone))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setError('이미 신청하셨습니다.'); setLoading(false); return
      }

      await addDoc(collection(db, 'applications'), {
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        phone,
        job: form.job,
        hobbies: form.hobbies.trim(),
        groupType: form.groupType,
        createdAt: serverTimestamp(),
      })

      onSuccess({ name: form.name.trim() })
    } catch (e) {
      setError('오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">모임 신청</h2>
        <p className="modal-sub">신청 완료 후 보증금 {depositAmount}을 입금하시면 확정됩니다.</p>

        <div className="form-group">
          <label className="form-label">이름 <span className="required">*</span></label>
          <input className="form-input" placeholder="실명" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">나이 <span className="required">*</span></label>
          <input className="form-input" type="number" placeholder="만 나이 (40~55세)" value={form.age} onChange={e => set('age', e.target.value)} min="35" max="60" />
        </div>

        <div className="form-group">
          <label className="form-label">성별 <span className="required">*</span></label>
          <div className="seg-btns col2">
            {['남성', '여성'].map(g => (
              <button key={g} className={`seg-btn ${form.gender === g ? 'active' : ''}`} onClick={() => set('gender', g)}>{g}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">연락처 <span className="required">*</span></label>
          <input className="form-input" type="tel" placeholder="01012345678" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={11} />
        </div>

        <div className="form-group">
          <label className="form-label">직업 <span className="required">*</span></label>
          <select className="form-select" value={form.job} onChange={e => set('job', e.target.value)}>
            <option value="">선택해주세요</option>
            {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">취미 <span className="required">*</span></label>
          <input className="form-input" placeholder="예: 등산, 독서, 요리" value={form.hobbies} onChange={e => set('hobbies', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">원하는 모임 형태 <span className="required">*</span></label>
          <div className="seg-btns col2">
            <button className={`seg-btn ${form.groupType === '2대2' ? 'active' : ''}`} onClick={() => set('groupType', '2대2')}>
              2대2<small>남 2명 · 여 2명</small>
            </button>
            <button className={`seg-btn ${form.groupType === '3대3' ? 'active' : ''}`} onClick={() => set('groupType', '3대3')}>
              3대3<small>남 3명 · 여 3명</small>
            </button>
          </div>
        </div>

        <div className="deposit-notice">
          <strong>보증금 안내</strong>
          신청 완료 후 24시간 이내에 아래 계좌로 {depositAmount}을 입금해주세요.<br/>
          <strong style={{color:'var(--primary)'}}>계좌: {bankInfo}</strong><br/>
          입금자명: 신청자 성함 · 참석 시 현장에서 100% 환급
        </div>

        <label className="agree-row">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span>입력한 개인정보는 모임 매칭 목적으로만 사용하며 모임 종료 후 삭제됩니다. 개인정보 수집·이용에 동의합니다.</span>
        </label>

        <button className="form-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? '제출 중...' : '신청 완료하기'}
        </button>
        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  )
}
