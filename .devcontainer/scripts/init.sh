# Create local env file
if [ ! -f "./.devcontainer/.env.local" ]; then
  echo "📝 Please enter your OpenAI API key (https://platform.openai.com/api-keys):"
  read openai_api_key

  devComputerName=$(git config --global user.email)

  echo "OPENAI_API_KEY="$openai_api_key"
" > ./.devcontainer/.env.local
fi

# Mount local env file in the projects root
if [ -f "./.env" ]; then
  rm ./.env
fi
cp ./.devcontainer/.env.dev ./.env
echo "" >> .env && cat ./.devcontainer/.env.local >> ./.env