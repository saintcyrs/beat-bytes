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
df = pd.read_csv("data2.csv")

# Make sure you have these columns in your dataframe
df["artist_genre"] = None
df["artist_popularity"] = None
df["album_cover_url"] = None


# Function to extract track ID from URI
def extract_track_id(uri):
    return uri.split(":")[-1]


# Function to get artist information
def get_artist_info(artist_id):
    try:
        artist_info = sp.artist(artist_id)
        genres = artist_info.get("genres", [])
        popularity = artist_info.get("popularity", 0)
        return genres, popularity
    except spotipy.client.SpotifyException as e:
        print(f"Error fetching artist info: {e}")
        return [], 0


# Function to get album cover image URL
def get_album_cover(album_id):
    try:
        album_info = sp.album(album_id)
        images = album_info.get("images", [])
        album_cover_url = images[0]["url"] if images else None
        return album_cover_url
    except spotipy.client.SpotifyException as e:
        print(f"Error fetching album cover: {e}")
        return None


# Updated function to get all required data
def get_track_data(track_id, index, track_name):
    try:
        track_data = sp.track(track_id)
        audio_features = sp.audio_features([track_id])[0]
        artist_id = track_data["artists"][0]["id"]
        album_id = track_data["album"]["id"]

        # Get artist genre and popularity
        artist_genres, artist_popularity = get_artist_info(artist_id)
        # Get album cover
        album_cover_url = get_album_cover(album_id)

        print(f"Processed track {index}: {track_name}")
        return audio_features, artist_genres, artist_popularity, album_cover_url

    except spotipy.client.SpotifyException as e:
        print(f"Error processing track {index}: {e}")
        return None, [], 0, None


# Setup ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=10) as executor:
    # Submit tasks to the executor
    future_to_index = {
        executor.submit(
            get_track_data, extract_track_id(row["uri"]), index, row["track_name"]
        ): index
        for index, row in df.iterrows()
    }

    for future in as_completed(future_to_index):
        index = future_to_index[future]
        (
            audio_features,
            artist_genres,
            artist_popularity,
            album_cover_url,
        ) = future.result()

        if audio_features:
            # Update dataframe with audio features
            for feature, value in audio_features.items():
                df.at[index, feature] = value

        # Update dataframe with artist genres, popularity and album cover
        df.at[index, "artist_genre"] = ",".join(
            artist_genres
        )  # Convert list to comma-separated string
        df.at[index, "artist_popularity"] = artist_popularity
        df.at[index, "album_cover_url"] = album_cover_url

# Save the updated dataframe to a new CSV, preserving the original data
df.to_csv("oct26.csv", index=False)
