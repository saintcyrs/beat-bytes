import time
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

# Authentication - without user
client_credentials_manager = SpotifyClientCredentials(
    client_id="637af8ea0ec44f269018fd816592b547",
    client_secret="5e519ee76368442096fdb6525321866d",
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
# Load existing data
df = pd.read_csv("data.csv")


# Function to extract track ID from URI
def extract_track_id(uri):
    return uri.split(":")[-1]


# Function to get audio features
def get_audio_features(track_id, index, track_name):
    try:
        audio_features = sp.audio_features([track_id])[0]
        if audio_features:
            print(f"Processed track {index}: {track_name}")
            return audio_features
        else:
            print(f"No features found for track {index}: {track_name}")
            return None
    except spotipy.client.SpotifyException as e:
        print(f"Error processing track {index}: {e}")
        return None


# Setup ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=10) as executor:
    # Submit tasks to the executor
    future_to_index = {
        executor.submit(
            get_audio_features, extract_track_id(row["uri"]), index, row["track_name"]
        ): index
        for index, row in df.iterrows()
    }

    for future in as_completed(future_to_index):
        index = future_to_index[future]
        audio_features = future.result()
        if audio_features:
            # Update dataframe with audio features
            for feature, value in audio_features.items():
                df.at[index, feature] = value
        # Sleep is probably not needed here since ThreadPoolExecutor will manage the queue of requests
        # time.sleep(0.1)  # You can adjust or remove this if not necessary

# Save the updated dataframe to a new CSV, preserving the original data
df.to_csv("updated_data_parallel.csv", index=False)
