import Card from './shared/Card';

function CommentItem({ id, content, createdAt, replies, score, user }) {
  return (
    <>
      <div className='comment-item'>
        <Card
          commentId={id}
          replyId={null}
          content={content}
          createdAt={createdAt}
          replies={replies}
          score={score}
          user={user}
        ></Card>
      </div>

      {replies?.length > 0 && (
        <div className='reply-container'>
          <div className='line'></div>
          <div className='reply-list'>
            {replies.map((reply) => (
              <div key={reply.id} className='reply-item'>
                <Card {...reply} commentId={id} replyId={reply.id}></Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
export default CommentItem;
