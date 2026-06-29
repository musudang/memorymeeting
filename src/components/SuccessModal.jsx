export default function SuccessModal({ data, bankInfo, depositAmount, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <span className="success-check">🎉</span>
        <h2 className="success-title">신청 완료!</h2>
        <p className="success-sub">
          {data.name}님, 신청해주셔서 감사해요.<br/>
          아래 계좌로 보증금을 입금하시면 모임이 확정됩니다.
        </p>

        <div className="success-box">
          <h3>보증금 입금 안내</h3>
          금액: <strong>{depositAmount}</strong><br/>
          계좌: <strong>{bankInfo}</strong><br/>
          입금자명: <strong>{data.name}</strong><br/>
          기한: <strong>24시간 이내</strong>
        </div>
        <p className="success-note">
          입금 확인 후 카카오톡으로 안내 드려요.<br/>
          모임 당일 참석하시면 현장에서 바로 환급됩니다.
        </p>

        <button className="success-close" onClick={onClose}>확인했어요</button>
      </div>
    </div>
  )
}
