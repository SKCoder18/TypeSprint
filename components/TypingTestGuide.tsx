import Link from 'next/link';

export default function TypingTestGuide() {
  return <section className="article" aria-labelledby="typing-test-guide">
    <h2 id="typing-test-guide">How to check your typing speed</h2>
    <p>Choose a 15-second, 30-second, one-minute or two-minute test above, then click the passage and type on a physical keyboard. Your first character starts the timer. TypeSprint shows your words per minute (WPM) and accuracy as you go. When the test ends, review your results or choose a new passage. No account is needed for this test.</p>
    <h3>What does WPM mean?</h3>
    <p>WPM means words per minute. This test treats five characters as one word: correct characters remaining in your typed text ÷ 5 ÷ elapsed minutes. For example, 200 correct characters in one minute gives 40 WPM. This is a practice result, not a certified typing qualification.</p>
    <h3>Why does accuracy matter?</h3>
    <p>Accuracy compares correct keystrokes with all attempted characters. Backspace lets you correct the passage, but it does not erase a mistaken attempt from your accuracy. Aim for steady, accurate typing before trying to increase speed. Compare tests of the same length and text mode to follow your progress.</p>
    <h3>Which typing test should I choose?</h3>
    <p>A 30-second test is a quick check; a one-minute or two-minute test gives you more time to settle into a rhythm. Words, sentences and punctuation place different demands on your fingers, so scores from different modes are not directly interchangeable.</p>
    <h3>How can beginners improve?</h3>
    <p>Start with the <Link href="/academy">free beginner typing lessons</Link> to learn the home row and finger placement. Move on to <Link href="/stories">story typing practice</Link> for connected sentences, or read the <Link href="/learn">WPM, accuracy and touch typing guide</Link>. Keep your hands relaxed and take breaks when you feel tired.</p>
    <p>Your recent test history is saved in this browser when local storage is available. Clearing browser data removes that local history. See the <Link href="/privacy">privacy details</Link>.</p>
  </section>;
}
