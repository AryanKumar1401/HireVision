import cv2
from fer import FER
import requests
import tempfile
import os


class VideoEmotionAnalyzer:
    def __init__(self):
        # Initialize the FER emotion detector
        self.emotion_detector = FER(mtcnn=True)
        
    def download_video(self, presigned_url):
        """Download video from Supabase presigned URL to a temporary file"""
        try:
            response = requests.get(presigned_url, stream=True)
            response.raise_for_status()
            
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
            
            # Write video content to temporary file
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    temp_file.write(chunk)
                    
            temp_file.close()
            return temp_file.name
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to download video: {str(e)}")

    def analyze_video(self, video_path, sample_rate=1):
        """
        Analyze emotions in video
        sample_rate: analyze every nth frame
        """
        results = []
        
        try:
            cap = cv2.VideoCapture(video_path)
            frame_count = 0
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Only analyze every nth frame based on sample_rate
                if frame_count % sample_rate == 0:
                    # Convert BGR to RGB
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    # Detect emotions
                    emotions = self.emotion_detector.detect_emotions(rgb_frame)
                    
                    if emotions:
                        for face in emotions:
                            result = {
                                'frame': frame_count,
                                'timestamp': frame_count / cap.get(cv2.CAP_PROP_FPS),
                                'emotions': face['emotions'],
                                'box': face['box']
                            }
                            results.append(result)
                
                frame_count += 1
                
            cap.release()
            
            return self.summarize_results(results)
            
        except Exception as e:
            raise Exception(f"Error analyzing video: {str(e)}")
        finally:
            if 'cap' in locals():
                cap.release()

    def summarize_results(self, results):
        """Summarize emotion detection results"""
        if not results:
            return {
                'error': 'No faces or emotions detected in video'
            }
            
        # Calculate average emotions across all frames
        emotion_sums = {
            'angry': 0, 'disgust': 0, 'fear': 0,
            'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0
        }
        
        for result in results:
            for emotion, value in result['emotions'].items():
                emotion_sums[emotion] += value
                
        num_detections = len(results)
        average_emotions = {
            emotion: value / num_detections 
            for emotion, value in emotion_sums.items()
        }
        
        # Find dominant emotion
        dominant_emotion = max(average_emotions.items(), key=lambda x: x[1])
        
        return {
            'summary': {
                'total_frames_analyzed': len(results),
                'dominant_emotion': dominant_emotion[0],
                'dominant_emotion_confidence': dominant_emotion[1],
                'average_emotions': average_emotions
            },
            'detailed_results': results
        }
    def plot_emotion_timeline(self, results):
        """Generate timeline plot of emotions"""
        timestamps = [r['timestamp'] for r in results]
        emotions_data = {
            emotion: [r['emotions'][emotion] for r in results]
            for emotion in ['happy', 'sad', 'angry', 'fear', 'surprise', 'neutral']
        }
        
        plt.figure(figsize=(12, 6))
        for emotion, values in emotions_data.items():
            plt.plot(timestamps, values, label=emotion, alpha=0.7)
            
        plt.xlabel('Time (seconds)')
        plt.ylabel('Emotion Intensity')
        plt.title('Emotion Timeline Throughout Video')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        # Save plot
        timeline_path = 'emotion_timeline.png'
        plt.savefig(timeline_path)
        plt.close()
        return timeline_path

    def plot_emotion_summary(self, summary):
        """Generate bar chart of average emotions"""
        emotions = summary['average_emotions']
        
        plt.figure(figsize=(10, 5))
        sns.barplot(x=list(emotions.keys()), y=list(emotions.values()))
        plt.xticks(rotation=45)
        plt.xlabel('Emotions')
        plt.ylabel('Average Intensity')
        plt.title('Summary of Emotions Detected')       
        # Save plot
        summary_path = 'emotion_summary.png'
        plt.savefig(summary_path, bbox_inches='tight')
        plt.close()
        return summary_path
        
def analyze_emotions_from_url(presigned_url, sample_rate=1):
    """Main function to analyze emotions from a Supabase presigned URL"""
    analyzer = VideoEmotionAnalyzer()
    
    try:
        # Download video
        print("Downloading video...")
        video_path = analyzer.download_video(presigned_url)
        
        # Analyze video
        print("Analyzing emotions...")
        results = analyzer.analyze_video(video_path, sample_rate)
        
        # Cleanup
        os.unlink(video_path)
        return results
    except Exception as e:
        return {'error': str(e)}
