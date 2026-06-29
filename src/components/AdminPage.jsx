import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

const PASS = 'memory2026'

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('전체')

  const login = () => {
    if (pw === PASS) { setAuth(true) }
    else alert('비밀번호가 틀렸어요.')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const all = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate().toLocaleString('ko-KR') }))

      const byGender = Object.entries(all.reduce((acc, r) => { acc[r.gender] = (acc[r.gender] || 0) + 1; return acc }, {}))
        .map(([gender, count]) => ({ gender, count }))
      const byGroup = Object.entries(all.reduce((acc, r) => { acc[r.groupType] = (acc[r.groupType] || 0) + 1; return acc }, {}))
        .map(([group_type, count]) => ({ group_type, count }))

      setData({ total: all.length, byGender, byGroup, recent: all })
    } catch (e) {
      alert('데이터를 불러올 수 없어요: ' + e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { if (auth) fetchData() }, [auth])

  const filtered = data?.recent?.filter(r => filter === '전체' || r.gender === filter) ?? []

  if (!auth) return (
    <div style={styles.loginWrap}>
      <h2 style={styles.loginTitle}>MEMORY 어드민</h2>
      <input style={styles.input} type="password" placeholder="비밀번호" value={pw}
        onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
      <button style={styles.btn} onClick={login}>로그인</button>
    </div>
  )

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.logo}>MEMORY 어드민</span>
        <button style={styles.refreshBtn} onClick={fetchData}>새로고침</button>
      </div>

      {loading ? <p style={styles.loading}>불러오는 중...</p> : data && <>
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{data.total}</span>
            <span style={styles.statLabel}>총 신청자</span>
          </div>
          {data.byGender.map(g => (
            <div key={g.gender} style={styles.statCard}>
              <span style={styles.statNum}>{g.count}</span>
              <span style={styles.statLabel}>{g.gender}</span>
            </div>
          ))}
          {data.byGroup.map(g => (
            <div key={g.group_type} style={styles.statCard}>
              <span style={styles.statNum}>{g.count}</span>
              <span style={styles.statLabel}>{g.group_type} 희망</span>
            </div>
          ))}
        </div>

        <div style={styles.filterRow}>
          {['전체', '남성', '여성'].map(f => (
            <button key={f} style={filter === f ? styles.filterActive : styles.filterBtn} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div style={styles.table}>
          <div style={styles.thead}>
            {['이름','나이','성별','연락처','직업','모임','취미','신청일시'].map(h => (
              <span key={h} style={{...styles.td, ...styles.th}}>{h}</span>
            ))}
          </div>
          {filtered.length === 0
            ? <p style={styles.empty}>신청자가 없어요.</p>
            : filtered.map(r => (
              <div key={r.id} style={styles.row}>
                <span style={{...styles.td, fontWeight:600}}>{r.name}</span>
                <span style={styles.td}>{r.age}세</span>
                <span style={styles.td}>{r.gender}</span>
                <span style={{...styles.td, color:'#555'}}>{r.phone}</span>
                <span style={styles.td}>{r.job}</span>
                <span style={{...styles.td, color:'#2D6A4F', fontWeight:600}}>{r.groupType}</span>
                <span style={{...styles.td, color:'#666', fontSize:'12px'}}>{r.hobbies}</span>
                <span style={{...styles.td, color:'#999', fontSize:'12px'}}>{r.createdAt}</span>
              </div>
            ))
          }
        </div>
      </>}
    </div>
  )
}

const styles = {
  loginWrap: { maxWidth:320, margin:'100px auto', padding:'32px 24px', border:'1px solid #eee', borderRadius:16, textAlign:'center', display:'flex', flexDirection:'column', gap:12 },
  loginTitle: { fontSize:22, fontWeight:800, marginBottom:8 },
  input: { padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:10, fontSize:16, outline:'none', fontFamily:'inherit' },
  btn: { padding:'13px', background:'#2D6A4F', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' },
  wrap: { maxWidth:960, margin:'0 auto', padding:'24px 20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  logo: { fontSize:20, fontWeight:800, color:'#2D6A4F' },
  refreshBtn: { padding:'8px 16px', background:'#f4f4f4', border:'none', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit' },
  loading: { textAlign:'center', color:'#999', marginTop:40 },
  statGrid: { display:'flex', gap:12, flexWrap:'wrap', marginBottom:24 },
  statCard: { flex:'1 1 80px', background:'#F8F8F6', borderRadius:12, padding:'16px 12px', textAlign:'center', display:'flex', flexDirection:'column', gap:4 },
  statNum: { fontSize:28, fontWeight:800, color:'#2D6A4F' },
  statLabel: { fontSize:12, color:'#999' },
  filterRow: { display:'flex', gap:8, marginBottom:16 },
  filterBtn: { padding:'7px 16px', border:'1.5px solid #ddd', borderRadius:20, background:'#fff', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
  filterActive: { padding:'7px 16px', border:'1.5px solid #2D6A4F', borderRadius:20, background:'#EAF4EE', color:'#2D6A4F', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
  table: { border:'1px solid #eee', borderRadius:12, overflow:'hidden', overflowX:'auto' },
  thead: { display:'flex', background:'#F8F8F6', padding:'10px 16px', borderBottom:'1px solid #eee', minWidth:700 },
  th: { fontSize:11, fontWeight:700, color:'#999', textTransform:'uppercase', flex:1 },
  row: { display:'flex', padding:'13px 16px', borderBottom:'1px solid #F4F4F4', fontSize:14, minWidth:700 },
  td: { flex:1, paddingRight:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  empty: { textAlign:'center', color:'#bbb', padding:'40px', fontSize:14 },
}
